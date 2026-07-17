import { Text, View } from 'react-native';

import { NovelCover } from '@/components/ui/NovelCover';
import type { Chapter, Novel } from '@/lib/data/types';
import { useI18n } from '@/lib/i18n/I18nProvider';

import { getTotalWords } from '../helpers';
import { styles } from '../styles';

type NovelHeroProps = {
  novel: Novel;
  chapters: Chapter[];
};

export function NovelHero({ novel, chapters }: NovelHeroProps) {
  const { t } = useI18n();
  const chapterCountLabel = t(chapters.length === 1 ? 'library.chapterSingular' : 'library.chapterPlural', {
    count: chapters.length,
  });

  return (
    <View style={styles.detailHero}>
      <NovelCover title={novel.title} size="large" />
      <View style={styles.detailHeroText}>
        <Text style={styles.detailTitle}>{novel.title}</Text>
        <Text style={styles.detailMeta}>
          {chapterCountLabel} · {t('common.words', { count: getTotalWords(chapters) })}
        </Text>
      </View>
    </View>
  );
}
