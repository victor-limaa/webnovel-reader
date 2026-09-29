import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
} from 'react-native';

import { getBrightness, setBrightness as setDeviceBrightness } from '@/infra/device/brightness';
import { getAvailableVoices, speakChunk, stopSpeech, type SpeechVoice } from '@/infra/speech/speechPlayer';
import { readChapterText } from '@/infra/storage/chapterTextStorage';
import { useDatabase } from '@/infra/storage/useDatabase';
import { useAppTheme } from '@/shared/design-system/theme/AppThemeContext';
import { readerThemes } from '@/shared/design-system/tokens';
import { useI18n } from '@/shared/i18n/I18nContext';
import type { AudioSettings, Chapter, ReaderSettings, ReaderTheme } from '@/shared/types/domain';

import { getAdjacentChapters, getAudioSettings, getChapter, getProgress, saveProgress, updateAudioSettings } from '../api/reader.repository';
import { getChunkIndexForOffset, getEstimatedSpeechOffset, getScrollProgress, getSeekOffset, splitForSpeech } from '../model/reader.utils';

const SEEK_SECONDS = 10;

export function useReaderViewModel() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const db = useDatabase();
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
  const [voices, setVoices] = useState<SpeechVoice[]>([]);
  const [brightness, setBrightness] = useState(1);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [charOffset, setCharOffset] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const speechStartOffsetRef = useRef(0);
  const speechStartedAtRef = useRef<number | null>(null);
  const speechTokenRef = useRef(0);
  const initialScrollRatioRef = useRef(0);
  const scrollContentHeightRef = useRef(0);
  const scrollLayoutHeightRef = useRef(0);
  const restoredScrollRef = useRef(false);
  const narrationOffsetRef = useRef(0);
  const scrollRatioRef = useRef(0);

  useEffect(() => {
    async function load() {
      if (!chapterId) {
        return;
      }

      setLoading(true);
      restoredScrollRef.current = false;
      scrollContentHeightRef.current = 0;
      scrollLayoutHeightRef.current = 0;
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
        getAvailableVoices(),
        getBrightness(),
      ]);

      setChapter(chapterResult);
      setAudioSettings(ttsSettings);
      setVoices(availableVoices);
      setBrightness(currentBrightness);
      setPrevious(adjacent.previous ?? null);
      setNext(adjacent.next ?? null);
      setText(content);
      const initialScrollRatio = progress?.chapterId === chapterResult.id ? progress.scrollRatio : 0;
      const initialNarrationOffset = progress?.chapterId === chapterResult.id ? progress.charOffset : 0;
      initialScrollRatioRef.current = initialScrollRatio;
      scrollRatioRef.current = initialScrollRatio;
      narrationOffsetRef.current = initialNarrationOffset;
      setCharOffset(initialNarrationOffset);
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

  const restoreInitialScroll = useCallback(() => {
    if (loading || restoredScrollRef.current) {
      return;
    }

    const contentHeight = scrollContentHeightRef.current;
    const layoutHeight = scrollLayoutHeightRef.current;
    if (contentHeight <= 0 || layoutHeight <= 0) {
      return;
    }

    restoredScrollRef.current = true;
    const maxScroll = Math.max(0, contentHeight - layoutHeight);
    const y = maxScroll * initialScrollRatioRef.current;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y, animated: false });
    });
  }, [loading]);

  function handleContentSizeChange(_width: number, height: number) {
    scrollContentHeightRef.current = height;
    restoreInitialScroll();
  }

  function handleScrollLayout(event: LayoutChangeEvent) {
    scrollLayoutHeightRef.current = event.nativeEvent.layout.height;
    restoreInitialScroll();
  }

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
    scrollRatioRef.current = progress.ratio;
  }

  async function handleScrollEnd() {
    await persistProgress(narrationOffsetRef.current, scrollRatioRef.current);
  }

  const getCurrentSpeechOffset = useCallback(() => {
    return getEstimatedSpeechOffset({
      baseOffset: isSpeaking ? speechStartOffsetRef.current : narrationOffsetRef.current,
      startedAt: isSpeaking ? speechStartedAtRef.current : null,
      rate: audioSettings?.rate ?? 1,
      textLength: text.length,
    });
  }, [audioSettings?.rate, isSpeaking, text.length]);

  const updateNarrationOffset = useCallback((nextOffset: number) => {
    const boundedOffset = Math.max(0, Math.min(text.length, Math.floor(nextOffset)));
    narrationOffsetRef.current = boundedOffset;
    setCharOffset(boundedOffset);
    return boundedOffset;
  }, [text.length]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' || !chapter) {
        return;
      }

      const nextOffset = isSpeaking ? getCurrentSpeechOffset() : narrationOffsetRef.current;
      updateNarrationOffset(nextOffset);
      persistProgress(nextOffset, scrollRatioRef.current).catch(() => undefined);
    });

    return () => subscription.remove();
  }, [chapter, getCurrentSpeechOffset, isSpeaking, persistProgress, updateNarrationOffset]);

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
      updateNarrationOffset(speechOffset);
      speechStartOffsetRef.current = speechOffset;
      speechStartedAtRef.current = Date.now();
      speechTokenRef.current += 1;
      const speechToken = speechTokenRef.current;
      await persistProgress(speechOffset, scrollRatioRef.current);

      speakChunk(speechText, playbackSettings, {
        onDone: async () => {
          if (speechToken !== speechTokenRef.current) {
            return;
          }

          const nextIndex = boundedIndex + 1;
          updateNarrationOffset(chunk.end);
          await persistProgress(chunk.end, scrollRatioRef.current);

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
    [audioSettings, chapter, chunks, next, persistProgress, router, t, updateNarrationOffset],
  );

  async function handlePlay() {
    speechTokenRef.current += 1;
    await stopSpeech();
    playFromChunk(getChunkIndexForOffset(chunks, charOffset, currentChunkIndex));
  }

  async function handlePause() {
    const nextOffset = getCurrentSpeechOffset();

    speechTokenRef.current += 1;
    await stopSpeech();
    setIsSpeaking(false);
    speechStartedAtRef.current = null;
    updateNarrationOffset(nextOffset);
    await persistProgress(nextOffset, scrollRatioRef.current);
  }

  async function handleTextSelection(start: number, end: number) {
    const nextOffset = updateNarrationOffset(Math.min(start, end));
    setCurrentChunkIndex(getChunkIndexForOffset(chunks, nextOffset, 0));
    speechTokenRef.current += 1;
    await stopSpeech();
    setIsSpeaking(false);
    speechStartedAtRef.current = null;
    await persistProgress(nextOffset, scrollRatioRef.current);
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
      await setDeviceBrightness(nextBrightness);
    } catch {
      // The local state still reflects the requested value when the OS denies access.
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

  async function saveAndStopNarration() {
    const nextOffset = isSpeaking ? getCurrentSpeechOffset() : narrationOffsetRef.current;
    speechTokenRef.current += 1;
    await stopSpeech();
    setIsSpeaking(false);
    speechStartedAtRef.current = null;
    updateNarrationOffset(nextOffset);
    await persistProgress(nextOffset, scrollRatioRef.current);
  }

  async function handleBack() {
    await saveAndStopNarration();

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

  async function openChapterList() {
    if (chapter) {
      await saveAndStopNarration();
      router.push(`/novel/${chapter.novelId}`);
    }
  }

  async function openAdjacentChapter(target: Chapter | null) {
    if (target) {
      await saveAndStopNarration();
      router.replace(`/reader/${target.id}`);
    }
  }

  return {
    chapter,
    previous,
    next,
    text,
    charOffset,
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
    handleContentSizeChange,
    handleScrollLayout,
    handleScrollEnd,
    handleTextSelection,
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
