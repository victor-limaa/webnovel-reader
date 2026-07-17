import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { getNovel, getProgress, listChapters } from '@/lib/data/repository';
import type { Chapter, Novel, ReadingProgress } from '@/lib/data/types';

import type { NovelDetailViewModel } from '../types';

export function useNovelDetailViewModel(): NovelDetailViewModel {
  const { novelId } = useLocalSearchParams<{ novelId: string }>();
  const db = useSQLiteContext();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!novelId) {
        return;
      }

      setLoading(true);
      const [novelResult, chapterResult, progressResult] = await Promise.all([
        getNovel(db, novelId),
        listChapters(db, novelId),
        getProgress(db, novelId),
      ]);

      setNovel(novelResult ?? null);
      setChapters(chapterResult);
      setProgress(progressResult ?? null);
      setLoading(false);
    }

    load();
  }, [db, novelId]);

  return {
    novel,
    chapters,
    progress,
    loading,
    resumeChapterId: progress?.chapterId ?? chapters[0]?.id,
  };
}
