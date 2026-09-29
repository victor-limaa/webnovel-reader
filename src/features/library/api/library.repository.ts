import type { SQLiteDatabase } from 'expo-sqlite';

import type { Chapter, Novel, ReadingProgress } from '@/shared/types/domain';

export async function listNovels(db: SQLiteDatabase) {
  return db.getAllAsync<Novel>(`
    SELECT novels.*, COUNT(chapters.id) AS chapterCount,
      lastChapter.title AS lastChapterTitle,
      reading_progress.chapterId AS progressChapterId,
      reading_progress.scrollRatio AS progressRatio
    FROM novels
    LEFT JOIN chapters ON chapters.novelId = novels.id
    LEFT JOIN reading_progress ON reading_progress.novelId = novels.id
    LEFT JOIN chapters AS lastChapter ON lastChapter.id = reading_progress.chapterId
    GROUP BY novels.id
    ORDER BY datetime(novels.updatedAt) DESC
  `);
}

export async function getNovel(db: SQLiteDatabase, novelId: string) {
  return db.getFirstAsync<Novel>(`
    SELECT novels.*, COUNT(chapters.id) AS chapterCount,
      lastChapter.title AS lastChapterTitle,
      reading_progress.chapterId AS progressChapterId,
      reading_progress.scrollRatio AS progressRatio
    FROM novels
    LEFT JOIN chapters ON chapters.novelId = novels.id
    LEFT JOIN reading_progress ON reading_progress.novelId = novels.id
    LEFT JOIN chapters AS lastChapter ON lastChapter.id = reading_progress.chapterId
    WHERE novels.id = ?
    GROUP BY novels.id
  `, novelId);
}

export async function listChapters(db: SQLiteDatabase, novelId: string) {
  return db.getAllAsync<Chapter>(
    'SELECT * FROM chapters WHERE novelId = ? ORDER BY chapterNumber ASC',
    novelId,
  );
}

export async function getProgress(db: SQLiteDatabase, novelId: string) {
  return db.getFirstAsync<ReadingProgress>('SELECT * FROM reading_progress WHERE novelId = ?', novelId);
}
