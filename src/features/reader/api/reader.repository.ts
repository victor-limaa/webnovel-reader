import type { SQLiteDatabase } from 'expo-sqlite';

import type { AudioSettings, Chapter, ReadingProgress } from '@/shared/types/domain';

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
      ON CONFLICT(novelId) DO UPDATE SET chapterId = excluded.chapterId,
        charOffset = excluded.charOffset, scrollRatio = excluded.scrollRatio, updatedAt = excluded.updatedAt`,
    progress.novelId,
    progress.chapterId,
    Math.max(0, Math.floor(progress.charOffset)),
    Math.max(0, Math.min(1, progress.scrollRatio)),
    now,
  );
}

export async function getAudioSettings(db: SQLiteDatabase) {
  return db.getFirstAsync<AudioSettings>('SELECT voiceIdentifier, language, rate, pitch FROM audio_settings WHERE id = 1');
}

export async function updateAudioSettings(db: SQLiteDatabase, settings: AudioSettings) {
  await db.runAsync(
    `INSERT INTO audio_settings (id, voiceIdentifier, language, rate, pitch) VALUES (1, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET voiceIdentifier = excluded.voiceIdentifier,
        language = excluded.language, rate = excluded.rate, pitch = excluded.pitch`,
    settings.voiceIdentifier,
    settings.language,
    settings.rate,
    settings.pitch,
  );
}
