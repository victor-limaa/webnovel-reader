import type { SQLiteDatabase } from 'expo-sqlite';

import type { AudioSettings, Chapter, Novel, ReaderSettings, ReadingProgress, SourceType } from './types';

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
    SELECT
      novels.*,
      COUNT(chapters.id) AS chapterCount,
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
  return db.getFirstAsync<Novel>(
    `
    SELECT
      novels.*,
      COUNT(chapters.id) AS chapterCount,
      lastChapter.title AS lastChapterTitle,
      reading_progress.chapterId AS progressChapterId,
      reading_progress.scrollRatio AS progressRatio
    FROM novels
    LEFT JOIN chapters ON chapters.novelId = novels.id
    LEFT JOIN reading_progress ON reading_progress.novelId = novels.id
    LEFT JOIN chapters AS lastChapter ON lastChapter.id = reading_progress.chapterId
    WHERE novels.id = ?
    GROUP BY novels.id
  `,
    novelId,
  );
}

export async function listChapters(db: SQLiteDatabase, novelId: string) {
  return db.getAllAsync<Chapter>(
    'SELECT * FROM chapters WHERE novelId = ? ORDER BY chapterNumber ASC',
    novelId,
  );
}

export async function getChapter(db: SQLiteDatabase, chapterId: string) {
  return db.getFirstAsync<Chapter>('SELECT * FROM chapters WHERE id = ?', chapterId);
}

export async function getAdjacentChapters(db: SQLiteDatabase, chapter: Chapter) {
  const previous = await db.getFirstAsync<Chapter>(
    'SELECT * FROM chapters WHERE novelId = ? AND chapterNumber < ? ORDER BY chapterNumber DESC LIMIT 1',
    chapter.novelId,
    chapter.chapterNumber,
  );
  const next = await db.getFirstAsync<Chapter>(
    'SELECT * FROM chapters WHERE novelId = ? AND chapterNumber > ? ORDER BY chapterNumber ASC LIMIT 1',
    chapter.novelId,
    chapter.chapterNumber,
  );

  return { previous, next };
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

export async function getProgress(db: SQLiteDatabase, novelId: string) {
  return db.getFirstAsync<ReadingProgress>('SELECT * FROM reading_progress WHERE novelId = ?', novelId);
}

export async function saveProgress(
  db: SQLiteDatabase,
  progress: { novelId: string; chapterId: string; charOffset: number; scrollRatio: number },
) {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO reading_progress (novelId, chapterId, charOffset, scrollRatio, updatedAt)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(novelId) DO UPDATE SET
        chapterId = excluded.chapterId,
        charOffset = excluded.charOffset,
        scrollRatio = excluded.scrollRatio,
        updatedAt = excluded.updatedAt`,
    progress.novelId,
    progress.chapterId,
    Math.max(0, Math.floor(progress.charOffset)),
    Math.max(0, Math.min(1, progress.scrollRatio)),
    now,
  );
}

export async function getReaderSettings(db: SQLiteDatabase) {
  return db.getFirstAsync<ReaderSettings>('SELECT fontSize, lineHeight, theme FROM reader_settings WHERE id = 1');
}

export async function updateReaderSettings(db: SQLiteDatabase, settings: ReaderSettings) {
  await db.runAsync(
    `INSERT INTO reader_settings (id, fontSize, lineHeight, theme)
      VALUES (1, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        fontSize = excluded.fontSize,
        lineHeight = excluded.lineHeight,
        theme = excluded.theme`,
    settings.fontSize,
    settings.lineHeight,
    settings.theme,
  );
}

export async function getAudioSettings(db: SQLiteDatabase) {
  return db.getFirstAsync<AudioSettings>('SELECT voiceIdentifier, language, rate, pitch FROM audio_settings WHERE id = 1');
}

export async function updateAudioSettings(db: SQLiteDatabase, settings: AudioSettings) {
  await db.runAsync(
    `INSERT INTO audio_settings (id, voiceIdentifier, language, rate, pitch)
      VALUES (1, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        voiceIdentifier = excluded.voiceIdentifier,
        language = excluded.language,
        rate = excluded.rate,
        pitch = excluded.pitch`,
    settings.voiceIdentifier,
    settings.language,
    settings.rate,
    settings.pitch,
  );
}
