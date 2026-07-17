import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { Chapter } from '@/lib/data/types';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { palette } from '@/lib/theme/tokens';

import { styles } from '../styles';

type ChapterCardProps = {
  chapter: Chapter;
  isCurrent: boolean;
  onPress: () => void;
};

export function ChapterCard({ chapter, isCurrent, onPress }: ChapterCardProps) {
  const { t } = useI18n();

  return (
    <Pressable style={({ pressed }) => [styles.chapterCard, pressed && styles.pressed]} onPress={onPress}>
      <View style={[styles.chapterBadge, isCurrent && styles.chapterBadgeActive]}>
        <Text style={[styles.chapterBadgeText, isCurrent && styles.chapterBadgeTextActive]}>
          {chapter.chapterNumber}
        </Text>
      </View>
      <View style={styles.chapterText}>
        <Text style={styles.chapterTitle} numberOfLines={2}>{chapter.title}</Text>
        <Text style={styles.chapterMeta}>
          {t('common.sourceMeta', { source: chapter.sourceType.toUpperCase(), count: chapter.wordCount })}
        </Text>
      </View>
      <Ionicons name={isCurrent ? 'bookmark' : 'chevron-forward'} size={20} color={isCurrent ? palette.gold : palette.muted} />
    </Pressable>
  );
}
