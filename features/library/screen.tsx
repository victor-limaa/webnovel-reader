import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useI18n } from '@/lib/i18n/I18nProvider';

import { LibraryHero } from './components/LibraryHero';
import { NovelCard } from './components/NovelCard';
import { useLibraryViewModel } from './hooks/useLibraryViewModel';
import { styles } from './styles';

export function LibraryScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { novels, loading, refresh } = useLibraryViewModel();

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <PageHeader eyebrow={t('library.eyebrow')} title={t('library.title')} />
        </View>
        <PrimaryButton title={t('library.import')} icon="add" onPress={() => router.push('/import')} />
      </View>

      <LibraryHero />

      <FlatList
        data={novels}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={novels.length === 0 ? styles.emptyList : styles.list}
        renderItem={({ item }) => (
          <NovelCard novel={item} onPress={() => router.push(`/novel/${item.id}`)} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="library"
            title={t('library.emptyTitle')}
            message={t('library.emptyMessage')}
          />
        }
      />
    </Screen>
  );
}
