import type { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

export async function migrateDatabase(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS novels (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        author TEXT,
        description TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY NOT NULL,
        novelId TEXT NOT NULL,
        title TEXT NOT NULL,
        chapterNumber INTEGER NOT NULL,
        sourceType TEXT NOT NULL,
        originalFileName TEXT,
        textFileUri TEXT NOT NULL,
        wordCount INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (novelId) REFERENCES novels(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reading_progress (
        novelId TEXT PRIMARY KEY NOT NULL,
        chapterId TEXT NOT NULL,
        charOffset INTEGER NOT NULL DEFAULT 0,
        scrollRatio REAL NOT NULL DEFAULT 0,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (novelId) REFERENCES novels(id) ON DELETE CASCADE,
        FOREIGN KEY (chapterId) REFERENCES chapters(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reader_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        fontSize INTEGER NOT NULL,
        lineHeight REAL NOT NULL,
        theme TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS audio_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        voiceIdentifier TEXT,
        language TEXT NOT NULL,
        rate REAL NOT NULL,
        pitch REAL NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_chapters_novel_order
        ON chapters (novelId, chapterNumber);
    `);

    await db.runAsync(
      'INSERT OR IGNORE INTO reader_settings (id, fontSize, lineHeight, theme) VALUES (?, ?, ?, ?)',
      1,
      20,
      1.58,
      'paper',
    );
    await db.runAsync(
      'INSERT OR IGNORE INTO audio_settings (id, voiceIdentifier, language, rate, pitch) VALUES (?, ?, ?, ?, ?)',
      1,
      null,
      'pt-BR',
      0.92,
      1,
    );
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
