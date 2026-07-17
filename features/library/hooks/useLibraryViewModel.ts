import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { listNovels } from '@/lib/data/repository';
import type { Novel } from '@/lib/data/types';

import type { LibraryViewModel } from '../types';

export function useLibraryViewModel(): LibraryViewModel {
  const db = useSQLiteContext();
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

  return { novels, loading, refresh };
}
