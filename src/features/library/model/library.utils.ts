import type { Chapter } from '@/shared/types/domain';

export function getNovelInitials(title: string) {
  return title.slice(0, 2).toUpperCase();
}

export function getTotalWords(chapters: Chapter[]) {
  return chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
}
