import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollView } from 'react-native';

import {
  getAdjacentChapters,
  getAudioSettings,
  getChapter,
  getProgress,
  getReaderSettings,
  saveProgress,
} from '@/lib/data/repository';
import type { AudioSettings, Chapter, ReaderSettings } from '@/lib/data/types';
import { readChapterText } from '@/lib/files/text-storage';
import { splitForSpeech, speakChunk, stopSpeech } from '@/lib/tts/speech-player';
import { readerThemes } from '@/lib/theme/tokens';

import { getChunkIndexForOffset, getScrollProgress } from '../helpers';

export function useReaderViewModel() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [previous, setPrevious] = useState<Chapter | null>(null);
  const [next, setNext] = useState<Chapter | null>(null);
  const [text, setText] = useState('');
  const [settings, setSettings] = useState<ReaderSettings | null>(null);
  const [audioSettings, setAudioSettings] = useState<AudioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [charOffset, setCharOffset] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  useEffect(() => {
    async function load() {
      if (!chapterId) {
        return;
      }

      setLoading(true);
      await stopSpeech();
      setIsSpeaking(false);

      const chapterResult = await getChapter(db, chapterId);
      if (!chapterResult) {
        setChapter(null);
        setLoading(false);
        return;
      }

      const [readerSettings, ttsSettings, progress, adjacent, content] = await Promise.all([
        getReaderSettings(db),
        getAudioSettings(db),
        getProgress(db, chapterResult.novelId),
        getAdjacentChapters(db, chapterResult),
        readChapterText(chapterResult.textFileUri),
      ]);

      setChapter(chapterResult);
      setSettings(readerSettings);
      setAudioSettings(ttsSettings);
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

  const playFromChunk = useCallback(
    async (index: number) => {
      if (!audioSettings || !chapter || chunks.length === 0) {
        return;
      }

      const boundedIndex = Math.max(0, Math.min(index, chunks.length - 1));
      const chunk = chunks[boundedIndex];
      setCurrentChunkIndex(boundedIndex);
      setIsSpeaking(true);
      await persistProgress(chunk.start, chunk.start / Math.max(1, text.length));

      speakChunk(chunk.text, audioSettings, {
        onDone: async () => {
          const nextIndex = boundedIndex + 1;
          await persistProgress(chunk.end, chunk.end / Math.max(1, text.length));

          if (nextIndex < chunks.length) {
            playFromChunk(nextIndex);
            return;
          }

          setIsSpeaking(false);
          if (next) {
            router.replace(`/reader/${next.id}`);
          }
        },
        onStopped: () => setIsSpeaking(false),
        onError: (message) => {
          setIsSpeaking(false);
          Alert.alert('Erro na narracao', message);
        },
      });
    },
    [audioSettings, chapter, chunks, next, persistProgress, router, text.length],
  );

  async function handlePlay() {
    await stopSpeech();
    playFromChunk(getChunkIndexForOffset(chunks, charOffset, currentChunkIndex));
  }

  async function handleStop() {
    await stopSpeech();
    setIsSpeaking(false);
    await persistProgress(charOffset, scrollRatio);
  }

  async function moveAudio(direction: -1 | 1) {
    await stopSpeech();
    playFromChunk(currentChunkIndex + direction);
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
    loading,
    isSpeaking,
    theme,
    scrollRef,
    handleBack,
    handlePlay,
    handleStop,
    handleScroll,
    handleScrollEnd,
    moveAudio,
    openAdjacentChapter,
    openChapterList,
  };
}
