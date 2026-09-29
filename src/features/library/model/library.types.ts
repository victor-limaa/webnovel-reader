import type { Chapter, Novel, ReadingProgress } from '@/shared/types/domain';

export type LibraryViewModel = {
  novels: Novel[];
  loading: boolean;
  refresh: () => Promise<void>;
  openImport: () => void;
  openNovel: (novelId: string) => void;
};

export type NovelDetailViewModel = {
  novel: Novel | null;
  chapters: Chapter[];
  progress: ReadingProgress | null;
  loading: boolean;
  resumeChapterId?: string;
  goBack: () => void;
  openChapter: (chapterId: string) => void;
};
