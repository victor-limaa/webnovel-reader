import { Text, View } from 'react-native';

import { NovelCover } from '@/components/ui/NovelCover';
import type { Chapter, Novel } from '@/lib/data/types';

import { formatChapterCount, getTotalWords } from '../helpers';
import { styles } from '../styles';

type NovelHeroProps = {
  novel: Novel;
  chapters: Chapter[];
};

export function NovelHero({ novel, chapters }: NovelHeroProps) {
  return (
    <View style={styles.detailHero}>
      <NovelCover title={novel.title} size="large" />
      <View style={styles.detailHeroText}>
        <Text style={styles.detailTitle}>{novel.title}</Text>
        <Text style={styles.detailMeta}>
          {formatChapterCount(chapters.length)} · {getTotalWords(chapters)} palavras
        </Text>
      </View>
    </View>
  );
}
