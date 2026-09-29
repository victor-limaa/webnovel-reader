import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { useDatabase } from '@/infra/storage/useDatabase';
import type { Novel } from '@/shared/types/domain';

import { listNovels } from '../api/library.repository';
import type { LibraryViewModel } from '../model/library.types';

export function useLibraryViewModel(): LibraryViewModel {
  const db = useDatabase();
  const router = useRouter();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setNovels(await listNovels(db));
    setLoading(false);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return {
    novels,
    loading,
    refresh,
    openImport: () => router.push('/import'),
    openNovel: (novelId) => router.push(`/novel/${novelId}`),
  };
}
