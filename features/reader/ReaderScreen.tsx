import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/app/IconButton';
import { Screen } from '@/components/app/Screen';
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
import { palette, readerThemes } from '@/lib/theme/tokens';

export function ReaderScreen() {
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

    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScroll = Math.max(1, contentSize.height - layoutMeasurement.height);
    const ratio = Math.max(0, Math.min(1, contentOffset.y / maxScroll));
    const offset = Math.floor(text.length * ratio);

    setScrollRatio(ratio);
    setCharOffset(offset);
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
    const chunkIndex = chunks.findIndex((chunk) => chunk.end >= charOffset);
    await stopSpeech();
    playFromChunk(chunkIndex >= 0 ? chunkIndex : currentChunkIndex);
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

  if (loading) {
    return (
      <Screen padded={false}>
        <View style={styles.center}>
          <ActivityIndicator color={palette.umber} />
        </View>
      </Screen>
    );
  }

  if (!chapter || !settings) {
    return (
      <Screen>
        <IconButton icon="arrow-back" onPress={() => router.back()} />
        <View style={styles.center}>
          <Text style={styles.missing}>Capitulo nao encontrado.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false} style={{ backgroundColor: theme.background }}>
      <View style={[styles.readerHeader, { backgroundColor: theme.background, borderBottomColor: theme.line }]}>
        <IconButton icon="arrow-back" onPress={() => router.back()} />
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{chapter.title}</Text>
          <Text style={[styles.headerMeta, { color: theme.muted }]}>Capitulo {chapter.chapterNumber}</Text>
        </View>
        <IconButton icon="list" onPress={() => router.push(`/novel/${chapter.novelId}`)} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={600}>
        <Text style={[styles.chapterTitle, { color: theme.text }]}>{chapter.title}</Text>
        <Text
          style={[
            styles.body,
            {
              color: theme.text,
              fontSize: settings.fontSize,
              lineHeight: Math.round(settings.fontSize * settings.lineHeight),
            },
          ]}>
          {text}
        </Text>
      </ScrollView>

      <View style={[styles.player, { backgroundColor: theme.panel, borderTopColor: theme.line }]}>
        <Pressable disabled={!previous} style={[styles.navButton, !previous && styles.disabled]} onPress={() => previous && router.replace(`/reader/${previous.id}`)}>
          <Ionicons name="play-skip-back" size={22} color={theme.accent} />
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => moveAudio(-1)}>
          <Ionicons name="play-back" size={22} color={theme.accent} />
        </Pressable>
        <Pressable style={[styles.playButton, { backgroundColor: theme.accent }]} onPress={isSpeaking ? handleStop : handlePlay}>
          <Ionicons name={isSpeaking ? 'stop' : 'play'} size={28} color={theme.panel} />
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => moveAudio(1)}>
          <Ionicons name="play-forward" size={22} color={theme.accent} />
        </Pressable>
        <Pressable disabled={!next} style={[styles.navButton, !next && styles.disabled]} onPress={() => next && router.replace(`/reader/${next.id}`)}>
          <Ionicons name="play-skip-forward" size={22} color={theme.accent} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missing: {
    color: palette.ink,
    fontWeight: '800',
  },
  readerHeader: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  headerMeta: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  chapterTitle: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '900',
    marginBottom: 22,
  },
  body: {
    fontFamily: 'serif',
  },
  player: {
    minHeight: 82,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
});
