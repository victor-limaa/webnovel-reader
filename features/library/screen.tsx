import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';

import { LibraryHero } from './components/LibraryHero';
import { NovelCard } from './components/NovelCard';
import { useLibraryViewModel } from './hooks/useLibraryViewModel';
import { styles } from './styles';

export function LibraryScreen() {
  const router = useRouter();
  const { novels, loading, refresh } = useLibraryViewModel();

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <PageHeader eyebrow="Arquivo local" title="Biblioteca" />
        </View>
        <PrimaryButton title="Importar" icon="add" onPress={() => router.push('/import')} />
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
            title="Sua estante ainda esta vazia"
            message="Importe arquivos TXT/PDF ou cole um capitulo para criar sua primeira webnovel local."
          />
        }
      />
    </Screen>
  );
}
