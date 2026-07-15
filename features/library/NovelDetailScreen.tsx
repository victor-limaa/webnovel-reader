import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/app/EmptyState';
import { IconButton } from '@/components/app/IconButton';
import { PrimaryButton } from '@/components/app/PrimaryButton';
import { Screen } from '@/components/app/Screen';
import { getNovel, getProgress, listChapters } from '@/lib/data/repository';
import type { Chapter, Novel, ReadingProgress } from '@/lib/data/types';
import { palette, shadows } from '@/lib/theme/tokens';

export function NovelDetailScreen() {
  const { novelId } = useLocalSearchParams<{ novelId: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!novelId) {
        return;
      }

      setLoading(true);
      const [novelResult, chapterResult, progressResult] = await Promise.all([
        getNovel(db, novelId),
        listChapters(db, novelId),
        getProgress(db, novelId),
      ]);
      setNovel(novelResult ?? null);
      setChapters(chapterResult);
      setProgress(progressResult ?? null);
      setLoading(false);
    }

    load();
  }, [db, novelId]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={palette.umber} />
        </View>
      </Screen>
    );
  }

  if (!novel) {
    return (
      <Screen>
        <IconButton icon="arrow-back" onPress={() => router.back()} />
        <EmptyState icon="alert-circle" title="Webnovel nao encontrada" message="Ela pode ter sido removida deste dispositivo." />
      </Screen>
    );
  }

  const resumeChapterId = progress?.chapterId ?? chapters[0]?.id;

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="arrow-back" onPress={() => router.back()} />
      </View>

      <View style={styles.hero}>
        <View style={styles.cover}>
          <Text style={styles.coverLetters}>{novel.title.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.title}>{novel.title}</Text>
          <Text style={styles.meta}>{chapters.length} capitulos · {chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0)} palavras</Text>
        </View>
      </View>

      <PrimaryButton
        title={progress ? 'Continuar leitura' : 'Comecar leitura'}
        icon="play"
        onPress={() => resumeChapterId && router.push(`/reader/${resumeChapterId}`)}
        disabled={!resumeChapterId}
      />

      <Text style={styles.sectionTitle}>Capitulos</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isCurrent = item.id === progress?.chapterId;
          return (
            <Pressable style={({ pressed }) => [styles.chapterCard, pressed && styles.pressed]} onPress={() => router.push(`/reader/${item.id}`)}>
              <View style={[styles.chapterBadge, isCurrent && styles.chapterBadgeActive]}>
                <Text style={[styles.chapterBadgeText, isCurrent && styles.chapterBadgeTextActive]}>{item.chapterNumber}</Text>
              </View>
              <View style={styles.chapterText}>
                <Text style={styles.chapterTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.chapterMeta}>{item.sourceType.toUpperCase()} · {item.wordCount} palavras</Text>
              </View>
              <Ionicons name={isCurrent ? 'bookmark' : 'chevron-forward'} size={20} color={isCurrent ? palette.gold : palette.muted} />
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: 'flex-start',
  },
  hero: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.panel,
    marginBottom: 14,
    ...shadows.lifted,
  },
  cover: {
    width: 82,
    height: 118,
    borderRadius: 8,
    backgroundColor: palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverLetters: {
    color: palette.panel,
    fontSize: 24,
    fontWeight: '900',
  },
  heroText: {
    flex: 1,
    gap: 8,
  },
  title: {
    color: palette.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  meta: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 10,
  },
  list: {
    gap: 10,
    paddingBottom: 28,
  },
  chapterCard: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 12,
  },
  pressed: {
    opacity: 0.82,
  },
  chapterBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.paperDeep,
  },
  chapterBadgeActive: {
    backgroundColor: palette.umber,
  },
  chapterBadgeText: {
    color: palette.umber,
    fontWeight: '900',
  },
  chapterBadgeTextActive: {
    color: palette.panel,
  },
  chapterText: {
    flex: 1,
    gap: 3,
  },
  chapterTitle: {
    color: palette.ink,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  chapterMeta: {
    color: palette.muted,
    fontSize: 12,
  },
});
