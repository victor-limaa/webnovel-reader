import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { palette } from '@/lib/theme/tokens';

import { ChapterCard } from './components/ChapterCard';
import { NovelHero } from './components/NovelHero';
import { useNovelDetailViewModel } from './hooks/useNovelDetailViewModel';
import { styles } from './styles';

export function NovelDetailScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { novel, chapters, progress, loading, resumeChapterId } = useNovelDetailViewModel();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

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
        <IconButton icon="arrow-back" onPress={handleBack} />
        <EmptyState icon="alert-circle" title={t('library.notFoundTitle')} message={t('library.notFoundMessage')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.detailHeader}>
        <IconButton icon="arrow-back" onPress={handleBack} />
      </View>

      <NovelHero novel={novel} chapters={chapters} />

      <PrimaryButton
        title={progress ? t('library.continue') : t('library.start')}
        icon="play"
        onPress={() => resumeChapterId && router.push(`/reader/${resumeChapterId}`)}
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
            onPress={() => router.push(`/reader/${item.id}`)}
          />
        )}
      />
    </Screen>
  );
}
