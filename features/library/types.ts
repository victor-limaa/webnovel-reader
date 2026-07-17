import type { Chapter, Novel, ReadingProgress } from '@/lib/data/types';

export type LibraryViewModel = {
  novels: Novel[];
  loading: boolean;
  refresh: () => Promise<void>;
};

export type NovelDetailViewModel = {
  novel: Novel | null;
  chapters: Chapter[];
  progress: ReadingProgress | null;
  loading: boolean;
  resumeChapterId?: string;
};
