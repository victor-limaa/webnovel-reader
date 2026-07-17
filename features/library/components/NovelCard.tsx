import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { NovelCover } from '@/components/ui/NovelCover';
import type { Novel } from '@/lib/data/types';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { palette } from '@/lib/theme/tokens';

import { styles } from '../styles';

type NovelCardProps = {
  novel: Novel;
  onPress: () => void;
};

export function NovelCard({ novel, onPress }: NovelCardProps) {
  const { t } = useI18n();
  const progress = Math.round((novel.progressRatio ?? 0) * 100);
  const chapterCountLabel = t(novel.chapterCount === 1 ? 'library.chapterSingular' : 'library.chapterPlural', {
    count: novel.chapterCount,
  });

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <NovelCover title={novel.title} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.novelTitle} numberOfLines={2}>{novel.title}</Text>
          <Ionicons name="chevron-forward" size={20} color={palette.muted} />
        </View>
        <Text style={styles.meta}>{chapterCountLabel}</Text>
        {novel.lastChapterTitle ? (
          <Text style={styles.resume} numberOfLines={1}>{t('library.resumeAt', { title: novel.lastChapterTitle })}</Text>
        ) : (
          <Text style={styles.resume} numberOfLines={1}>{t('library.ready')}</Text>
        )}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </Pressable>
  );
}
