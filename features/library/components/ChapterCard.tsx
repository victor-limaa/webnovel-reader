import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { Chapter } from '@/lib/data/types';
import { palette } from '@/lib/theme/tokens';

import { styles } from '../styles';

type ChapterCardProps = {
  chapter: Chapter;
  isCurrent: boolean;
  onPress: () => void;
};

export function ChapterCard({ chapter, isCurrent, onPress }: ChapterCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.chapterCard, pressed && styles.pressed]} onPress={onPress}>
      <View style={[styles.chapterBadge, isCurrent && styles.chapterBadgeActive]}>
        <Text style={[styles.chapterBadgeText, isCurrent && styles.chapterBadgeTextActive]}>
          {chapter.chapterNumber}
        </Text>
      </View>
      <View style={styles.chapterText}>
        <Text style={styles.chapterTitle} numberOfLines={2}>{chapter.title}</Text>
        <Text style={styles.chapterMeta}>{chapter.sourceType.toUpperCase()} · {chapter.wordCount} palavras</Text>
      </View>
      <Ionicons name={isCurrent ? 'bookmark' : 'chevron-forward'} size={20} color={isCurrent ? palette.gold : palette.muted} />
    </Pressable>
  );
}
