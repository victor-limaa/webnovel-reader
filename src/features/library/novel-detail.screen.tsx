import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { EmptyState } from '@/shared/design-system/components/EmptyState';
import { IconButton } from '@/shared/design-system/components/IconButton';
import { PrimaryButton } from '@/shared/design-system/components/PrimaryButton';
import { Screen } from '@/shared/design-system/components/Screen';
import { palette } from '@/shared/design-system/tokens';
import { useI18n } from '@/shared/i18n/I18nContext';

import { ChapterCard } from './components/ChapterCard';
import { NovelHero } from './components/NovelHero';
import { useNovelDetailViewModel } from './hooks/useNovelDetailViewModel';
import { styles } from './library.styles';

export function NovelDetailScreen() {
  const { t } = useI18n();
  const { novel, chapters, progress, loading, resumeChapterId, goBack, openChapter } = useNovelDetailViewModel();

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={palette.umber} />
        </View>
      </Screen>
    );
  }

  if (!novel) {
    return (
      <Screen>
        <IconButton icon="arrow-back" onPress={goBack} />
        <EmptyState icon="alert-circle" title={t('library.notFoundTitle')} message={t('library.notFoundMessage')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.detailHeader}>
        <IconButton icon="arrow-back" onPress={goBack} />
      </View>

      <NovelHero novel={novel} chapters={chapters} />

      <PrimaryButton
        title={progress ? t('library.continue') : t('library.start')}
        icon="play"
        onPress={() => resumeChapterId && openChapter(resumeChapterId)}
        disabled={!resumeChapterId}
      />

      <Text style={styles.sectionTitle}>{t('library.chapters')}</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chapterList}
        renderItem={({ item }) => (
          <ChapterCard
            chapter={item}
            isCurrent={item.id === progress?.chapterId}
            onPress={() => openChapter(item.id)}
          />
        )}
      />
    </Screen>
  );
}
