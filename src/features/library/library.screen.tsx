import { FlatList, View } from 'react-native';

import { EmptyState } from '@/shared/design-system/components/EmptyState';
import { PageHeader } from '@/shared/design-system/components/PageHeader';
import { PrimaryButton } from '@/shared/design-system/components/PrimaryButton';
import { Screen } from '@/shared/design-system/components/Screen';
import { useI18n } from '@/shared/i18n/I18nContext';

import { LibraryHero } from './components/LibraryHero';
import { NovelCard } from './components/NovelCard';
import { useLibraryViewModel } from './hooks/useLibraryViewModel';
import { styles } from './library.styles';

export function LibraryScreen() {
  const { t } = useI18n();
  const { novels, loading, refresh, openImport, openNovel } = useLibraryViewModel();

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <PageHeader eyebrow={t('library.eyebrow')} title={t('library.title')} />
        </View>
        <PrimaryButton title={t('library.import')} icon="add" onPress={openImport} />
      </View>

      <LibraryHero />

      <FlatList
        data={novels}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={novels.length === 0 ? styles.emptyList : styles.list}
        renderItem={({ item }) => (
          <NovelCard novel={item} onPress={() => openNovel(item.id)} />
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
