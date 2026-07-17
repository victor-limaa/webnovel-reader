import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { NovelCover } from '@/components/ui/NovelCover';
import type { Novel } from '@/lib/data/types';
import { palette } from '@/lib/theme/tokens';

import { formatChapterCount } from '../helpers';
import { styles } from '../styles';

type NovelCardProps = {
  novel: Novel;
  onPress: () => void;
};

export function NovelCard({ novel, onPress }: NovelCardProps) {
  const progress = Math.round((novel.progressRatio ?? 0) * 100);

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <NovelCover title={novel.title} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.novelTitle} numberOfLines={2}>{novel.title}</Text>
          <Ionicons name="chevron-forward" size={20} color={palette.muted} />
        </View>
        <Text style={styles.meta}>{formatChapterCount(novel.chapterCount)}</Text>
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
