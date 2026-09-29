import { Text, View } from 'react-native';

import { NovelCover } from '@/shared/design-system/components/NovelCover';
import { useI18n } from '@/shared/i18n/I18nContext';
import type { Chapter, Novel } from '@/shared/types/domain';

import { styles } from '../library.styles';
import { getTotalWords } from '../model/library.utils';

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
