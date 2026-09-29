import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/shared/design-system/tokens';
import { useI18n } from '@/shared/i18n/I18nContext';
import type { Chapter } from '@/shared/types/domain';

import { styles } from '../library.styles';

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
