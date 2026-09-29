import type { SQLiteDatabase } from 'expo-sqlite';

import type { Novel, SourceType } from '@/shared/types/domain';

type ChapterInput = {
  id: string;
  novelId: string;
  title: string;
  chapterNumber: number;
  sourceType: SourceType;
  originalFileName?: string | null;
  textFileUri: string;
  wordCount: number;
};

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

export async function createNovelWithChapters(
  db: SQLiteDatabase,
  novel: { id: string; title: string; author?: string | null; description?: string | null },
  chapters: ChapterInput[],
) {
  const now = new Date().toISOString();

  await db.withExclusiveTransactionAsync(async (transaction) => {
    await transaction.runAsync(
      'INSERT INTO novels (id, title, author, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      novel.id,
      novel.title.trim(),
      novel.author?.trim() || null,
      novel.description?.trim() || null,
      now,
      now,
    );

    for (const chapter of chapters) {
      await transaction.runAsync(
        `INSERT INTO chapters
          (id, novelId, title, chapterNumber, sourceType, originalFileName, textFileUri, wordCount, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        chapter.id,
        chapter.novelId,
        chapter.title.trim(),
        chapter.chapterNumber,
        chapter.sourceType,
        chapter.originalFileName ?? null,
        chapter.textFileUri,
        chapter.wordCount,
        now,
      );
    }
  });
}

export async function addManualChapter(
  db: SQLiteDatabase,
  novel: { id: string; title: string; existingNovelId?: string | null },
  chapter: ChapterInput,
) {
  const now = new Date().toISOString();

  await db.withExclusiveTransactionAsync(async (transaction) => {
    if (!novel.existingNovelId) {
      await transaction.runAsync(
        'INSERT INTO novels (id, title, author, description, createdAt, updatedAt) VALUES (?, ?, NULL, NULL, ?, ?)',
        novel.id,
        novel.title.trim(),
        now,
        now,
      );
    } else {
      await transaction.runAsync('UPDATE novels SET updatedAt = ? WHERE id = ?', now, novel.existingNovelId);
    }

    await transaction.runAsync(
      `INSERT INTO chapters
        (id, novelId, title, chapterNumber, sourceType, originalFileName, textFileUri, wordCount, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      chapter.id,
      chapter.novelId,
      chapter.title.trim(),
      chapter.chapterNumber,
      chapter.sourceType,
      chapter.originalFileName ?? null,
      chapter.textFileUri,
      chapter.wordCount,
      now,
    );
  });
}

export async function getNextChapterNumber(db: SQLiteDatabase, novelId: string) {
  const row = await db.getFirstAsync<{ nextNumber: number }>(
    'SELECT COALESCE(MAX(chapterNumber), 0) + 1 AS nextNumber FROM chapters WHERE novelId = ?',
    novelId,
  );
  return row?.nextNumber ?? 1;
}
