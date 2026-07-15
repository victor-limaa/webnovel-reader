import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/app/EmptyState';
import { PrimaryButton } from '@/components/app/PrimaryButton';
import { Screen } from '@/components/app/Screen';
import type { Novel } from '@/lib/data/types';
import { listNovels } from '@/lib/data/repository';
import { palette, shadows } from '@/lib/theme/tokens';

function NovelCard({ novel, onPress }: { novel: Novel; onPress: () => void }) {
  const progress = Math.round((novel.progressRatio ?? 0) * 100);

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.cover}>
        <Text style={styles.coverLetters}>{novel.title.slice(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.novelTitle} numberOfLines={2}>{novel.title}</Text>
          <Ionicons name="chevron-forward" size={20} color={palette.muted} />
        </View>
        <Text style={styles.meta}>
          {novel.chapterCount} {novel.chapterCount === 1 ? 'capitulo' : 'capitulos'}
        </Text>
        {novel.lastChapterTitle ? (
          <Text style={styles.resume} numberOfLines={1}>Continuar em {novel.lastChapterTitle}</Text>
        ) : (
          <Text style={styles.resume} numberOfLines={1}>Pronta para iniciar</Text>
        )}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </Pressable>
  );
}

export function LibraryScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setNovels(await listNovels(db));
    setLoading(false);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Arquivo local</Text>
          <Text style={styles.title}>Biblioteca</Text>
        </View>
        <PrimaryButton title="Importar" icon="add" onPress={() => router.push('/import')} />
      </View>

      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Leia offline, escute quando quiser.</Text>
          <Text style={styles.heroBody}>TXT, PDF digital e textos colados ficam salvos no dispositivo.</Text>
        </View>
        <View style={styles.heroMark}>
          <Ionicons name="book" size={36} color={palette.panel} />
        </View>
      </View>

      <FlatList
        data={novels}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={novels.length === 0 ? styles.emptyList : styles.list}
        renderItem={({ item }) => (
          <NovelCard novel={item} onPress={() => router.push(`/novel/${item.id}`)} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="library"
            title="Sua estante ainda esta vazia"
            message="Importe arquivos TXT/PDF ou cole um capitulo para criar sua primeira webnovel local."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  eyebrow: {
    color: palette.umber,
    textTransform: 'uppercase',
    letterSpacing: 0,
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    color: palette.ink,
    fontSize: 36,
    fontWeight: '900',
  },
  hero: {
    minHeight: 132,
    borderRadius: 8,
    padding: 18,
    backgroundColor: palette.umberDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroText: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  heroTitle: {
    color: palette.panel,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  heroBody: {
    color: '#E9D4BD',
    fontSize: 14,
    lineHeight: 20,
  },
  heroMark: {
    width: 72,
    height: 96,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: palette.umber,
    borderWidth: 1,
    borderColor: '#A56B3E',
    transform: [{ rotate: '7deg' }],
  },
  list: {
    gap: 12,
    paddingBottom: 28,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    borderRadius: 8,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
    ...shadows.lifted,
  },
  pressed: {
    opacity: 0.82,
  },
  cover: {
    width: 58,
    minHeight: 82,
    borderRadius: 6,
    backgroundColor: palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverLetters: {
    color: palette.panel,
    fontSize: 18,
    fontWeight: '900',
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  novelTitle: {
    flex: 1,
    color: palette.ink,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },
  meta: {
    color: palette.umber,
    fontSize: 13,
    fontWeight: '800',
  },
  resume: {
    color: palette.muted,
    fontSize: 13,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.paperDeep,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.gold,
  },
});
