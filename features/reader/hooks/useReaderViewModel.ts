import * as Speech from 'expo-speech';
import * as Brightness from 'expo-brightness';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollView } from 'react-native';

import {
  getAdjacentChapters,
  getAudioSettings,
  getChapter,
  getProgress,
  saveProgress,
  updateAudioSettings,
} from '@/lib/data/repository';
import type { AudioSettings, Chapter, ReaderSettings, ReaderTheme } from '@/lib/data/types';
import { readChapterText } from '@/lib/files/text-storage';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { useAppTheme } from '@/lib/theme/AppThemeProvider';
import { splitForSpeech, speakChunk, stopSpeech } from '@/lib/tts/speech-player';
import { readerThemes } from '@/lib/theme/tokens';

import { getChunkIndexForOffset, getEstimatedSpeechOffset, getScrollProgress, getSeekOffset } from '../helpers';

const SEEK_SECONDS = 10;

export function useReaderViewModel() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const { t } = useI18n();
  const { readerSettings, updateReaderSettings } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [previous, setPrevious] = useState<Chapter | null>(null);
  const [next, setNext] = useState<Chapter | null>(null);
  const [text, setText] = useState('');
  const [settings, setSettings] = useState<ReaderSettings | null>(readerSettings);
  const [audioSettings, setAudioSettings] = useState<AudioSettings | null>(null);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [brightness, setBrightness] = useState(1);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [charOffset, setCharOffset] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const speechStartOffsetRef = useRef(0);
  const speechStartedAtRef = useRef<number | null>(null);
  const speechTokenRef = useRef(0);

  useEffect(() => {
    async function load() {
      if (!chapterId) {
        return;
      }

      setLoading(true);
      await stopSpeech();
      setIsSpeaking(false);
      speechStartedAtRef.current = null;
      speechTokenRef.current += 1;

      const chapterResult = await getChapter(db, chapterId);
      if (!chapterResult) {
        setChapter(null);
        setLoading(false);
        return;
      }

      const [ttsSettings, progress, adjacent, content, availableVoices, currentBrightness] = await Promise.all([
        getAudioSettings(db),
        getProgress(db, chapterResult.novelId),
        getAdjacentChapters(db, chapterResult),
        readChapterText(chapterResult.textFileUri),
        Speech.getAvailableVoicesAsync().catch(() => []),
        Brightness.getSystemBrightnessAsync().catch(() => 1),
      ]);

      setChapter(chapterResult);
      setSettings(readerSettings);
      setAudioSettings(ttsSettings);
      setVoices(availableVoices);
      setBrightness(currentBrightness);
      setPrevious(adjacent.previous ?? null);
      setNext(adjacent.next ?? null);
      setText(content);
      setScrollRatio(progress?.chapterId === chapterResult.id ? progress.scrollRatio : 0);
      setCharOffset(progress?.chapterId === chapterResult.id ? progress.charOffset : 0);
      setCurrentChunkIndex(0);
      setLoading(false);
    }

    load();

    return () => {
      stopSpeech();
    };
  }, [db, chapterId]);

  useEffect(() => {
    setSettings(readerSettings);
  }, [readerSettings]);

  const chunks = useMemo(() => splitForSpeech(text), [text]);
  const theme = readerThemes[settings?.theme ?? 'paper'];

  useEffect(() => {
    if (!loading && scrollRatio > 0) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 6000 * scrollRatio, animated: false });
      });
    }
  }, [loading, scrollRatio]);

  const persistProgress = useCallback(
    async (nextOffset: number, nextRatio: number) => {
      if (!chapter) {
        return;
      }

      await saveProgress(db, {
        novelId: chapter.novelId,
        chapterId: chapter.id,
        charOffset: nextOffset,
        scrollRatio: nextRatio,
      });
    },
    [chapter, db],
  );

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!chapter) {
      return;
    }

    const progress = getScrollProgress(event.nativeEvent, text.length);
    setScrollRatio(progress.ratio);
    setCharOffset(progress.offset);
  }

  async function handleScrollEnd() {
    await persistProgress(charOffset, scrollRatio);
  }

  function getCurrentSpeechOffset() {
    return getEstimatedSpeechOffset({
      baseOffset: isSpeaking ? speechStartOffsetRef.current : charOffset,
      startedAt: isSpeaking ? speechStartedAtRef.current : null,
      rate: audioSettings?.rate ?? 1,
      textLength: text.length,
    });
  }

  const playFromChunk = useCallback(
    async (index: number, offset?: number, playbackSettings: AudioSettings | null = audioSettings) => {
      if (!playbackSettings || !chapter || chunks.length === 0) {
        return;
      }

      const boundedIndex = Math.max(0, Math.min(index, chunks.length - 1));
      const chunk = chunks[boundedIndex];
      const requestedOffset = Math.max(chunk.start, Math.min(offset ?? chunk.start, chunk.end));
      const relativeOffset = Math.max(0, Math.min(chunk.text.length, requestedOffset - chunk.start));
      const trimmedText = chunk.text.slice(relativeOffset);
      const trimDelta = trimmedText.length - trimmedText.trimStart().length;
      const speechText = trimmedText.trimStart();
      const speechOffset = requestedOffset + trimDelta;

      if (!speechText) {
        if (boundedIndex + 1 < chunks.length) {
          playFromChunk(boundedIndex + 1, undefined, playbackSettings);
          return;
        }

        setIsSpeaking(false);
        speechStartedAtRef.current = null;
        return;
      }

      setCurrentChunkIndex(boundedIndex);
      setIsSpeaking(true);
      setCharOffset(speechOffset);
      setScrollRatio(speechOffset / Math.max(1, text.length));
      speechStartOffsetRef.current = speechOffset;
      speechStartedAtRef.current = Date.now();
      speechTokenRef.current += 1;
      const speechToken = speechTokenRef.current;
      await persistProgress(speechOffset, speechOffset / Math.max(1, text.length));

      speakChunk(speechText, playbackSettings, {
        onDone: async () => {
          if (speechToken !== speechTokenRef.current) {
            return;
          }

          const nextIndex = boundedIndex + 1;
          await persistProgress(chunk.end, chunk.end / Math.max(1, text.length));

          if (nextIndex < chunks.length) {
            playFromChunk(nextIndex, undefined, playbackSettings);
            return;
          }

          setIsSpeaking(false);
          speechStartedAtRef.current = null;
          if (next) {
            router.replace(`/reader/${next.id}`);
          }
        },
        onStopped: () => {
          if (speechToken !== speechTokenRef.current) {
            return;
          }

          setIsSpeaking(false);
          speechStartedAtRef.current = null;
        },
        onError: (message) => {
          if (speechToken !== speechTokenRef.current) {
            return;
          }

          setIsSpeaking(false);
          speechStartedAtRef.current = null;
          Alert.alert(t('reader.speechErrorTitle'), message);
        },
      });
    },
    [audioSettings, chapter, chunks, next, persistProgress, router, text.length],
  );

  async function handlePlay() {
    speechTokenRef.current += 1;
    await stopSpeech();
    playFromChunk(getChunkIndexForOffset(chunks, charOffset, currentChunkIndex));
  }

  async function handlePause() {
    const nextOffset = getCurrentSpeechOffset();
    const nextRatio = nextOffset / Math.max(1, text.length);

    speechTokenRef.current += 1;
    await stopSpeech();
    setIsSpeaking(false);
    speechStartedAtRef.current = null;
    setCharOffset(nextOffset);
    setScrollRatio(nextRatio);
    await persistProgress(nextOffset, nextRatio);
  }

  async function seekAudio(direction: -1 | 1) {
    const estimatedOffset = getCurrentSpeechOffset();
    const nextOffset = getSeekOffset({
      currentOffset: estimatedOffset,
      direction,
      seconds: SEEK_SECONDS,
      rate: audioSettings?.rate ?? 1,
      textLength: text.length,
    });
    const nextChunkIndex = getChunkIndexForOffset(chunks, nextOffset, currentChunkIndex);

    speechTokenRef.current += 1;
    await stopSpeech();
    playFromChunk(nextChunkIndex, nextOffset);
  }

  async function updateReaderTheme(themeName: ReaderTheme) {
    if (!settings) {
      return;
    }

    const nextSettings = { ...settings, theme: themeName };
    setSettings(nextSettings);
    await updateReaderSettings(nextSettings);
  }

  async function updateFontSize(fontSize: number) {
    if (!settings) {
      return;
    }

    const nextSettings = { ...settings, fontSize };
    setSettings(nextSettings);
    await updateReaderSettings(nextSettings);
  }

  async function updateBrightness(brightnessValue: number) {
    const nextBrightness = Math.max(0.05, Math.min(1, brightnessValue));
    setBrightness(nextBrightness);

    try {
      const permission = await Brightness.requestPermissionsAsync();
      if (permission.granted) {
        await Brightness.setSystemBrightnessAsync(nextBrightness);
        return;
      }

      await Brightness.setBrightnessAsync(nextBrightness);
    } catch {
      await Brightness.setBrightnessAsync(nextBrightness).catch(() => undefined);
    }
  }

  async function updateAudioRate(rate: number) {
    if (!audioSettings) {
      return;
    }

    const shouldResume = isSpeaking;
    const nextOffset = shouldResume ? getCurrentSpeechOffset() : charOffset;
    const nextChunkIndex = getChunkIndexForOffset(chunks, nextOffset, currentChunkIndex);
    const nextSettings = { ...audioSettings, rate };
    setAudioSettings(nextSettings);
    await updateAudioSettings(db, nextSettings);

    if (shouldResume) {
      speechTokenRef.current += 1;
      await stopSpeech();
      playFromChunk(nextChunkIndex, nextOffset, nextSettings);
    }
  }

  async function updateNarrationVoice(voiceIdentifier: string | null) {
    if (!audioSettings) {
      return;
    }

    const voice = voices.find((item) => item.identifier === voiceIdentifier);
    const nextSettings = {
      ...audioSettings,
      voiceIdentifier,
      language: voice?.language ?? audioSettings.language,
    };
    setAudioSettings(nextSettings);
    await updateAudioSettings(db, nextSettings);
  }

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    if (chapter) {
      router.replace(`/novel/${chapter.novelId}`);
      return;
    }

    router.replace('/');
  }

  function openChapterList() {
    if (chapter) {
      router.push(`/novel/${chapter.novelId}`);
    }
  }

  function openAdjacentChapter(target: Chapter | null) {
    if (target) {
      router.replace(`/reader/${target.id}`);
    }
  }

  return {
    chapter,
    previous,
    next,
    text,
    settings,
    audioSettings,
    loading,
    isSpeaking,
    theme,
    voices,
    brightness,
    settingsVisible,
    scrollRef,
    handleBack,
    handlePlay,
    handlePause,
    handleScroll,
    handleScrollEnd,
    seekAudio,
    setBrightness,
    updateBrightness,
    setSettingsVisible,
    updateAudioRate,
    updateFontSize,
    updateNarrationVoice,
    updateReaderTheme,
    openAdjacentChapter,
    openChapterList,
  };
}
