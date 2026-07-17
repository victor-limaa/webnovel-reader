import { Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';

import { styles } from '../styles';
import type { ReaderHeaderProps } from '../types';

export function ReaderHeader({ chapter, theme, onBack, onOpenChapterList }: ReaderHeaderProps) {
  return (
    <View style={[styles.readerHeader, { backgroundColor: theme.background, borderBottomColor: theme.line }]}>
      <IconButton icon="arrow-back" onPress={onBack} />
      <View style={styles.headerText}>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{chapter.title}</Text>
        <Text style={[styles.headerMeta, { color: theme.muted }]}>Capitulo {chapter.chapterNumber}</Text>
      </View>
      <IconButton icon="list" onPress={onOpenChapterList} />
    </View>
  );
}
