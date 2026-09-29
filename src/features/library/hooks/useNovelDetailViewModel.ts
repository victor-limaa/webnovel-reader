import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { useDatabase } from '@/infra/storage/useDatabase';
import type { Chapter, Novel, ReadingProgress } from '@/shared/types/domain';

import { getNovel, getProgress, listChapters } from '../api/library.repository';
import type { NovelDetailViewModel } from '../model/library.types';

export function useNovelDetailViewModel(): NovelDetailViewModel {
  const { novelId } = useLocalSearchParams<{ novelId: string }>();
  const router = useRouter();
  const db = useDatabase();
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
    goBack: () => {
      if (router.canGoBack()) {
        router.back();
        return;
      }

      router.replace('/');
    },
    openChapter: (chapterId) => router.push(`/reader/${chapterId}`),
  };
}
