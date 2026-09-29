import type { SQLiteDatabase } from 'expo-sqlite';

import type { AppSettings, AudioSettings, ReaderSettings } from '@/shared/types/domain';

export async function getReaderSettings(db: SQLiteDatabase) {
  return db.getFirstAsync<ReaderSettings>('SELECT fontSize, lineHeight, theme FROM reader_settings WHERE id = 1');
}

export async function updateReaderSettings(db: SQLiteDatabase, settings: ReaderSettings) {
  await db.runAsync(
    `INSERT INTO reader_settings (id, fontSize, lineHeight, theme) VALUES (1, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET fontSize = excluded.fontSize,
        lineHeight = excluded.lineHeight, theme = excluded.theme`,
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
    `INSERT INTO audio_settings (id, voiceIdentifier, language, rate, pitch) VALUES (1, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET voiceIdentifier = excluded.voiceIdentifier,
        language = excluded.language, rate = excluded.rate, pitch = excluded.pitch`,
    settings.voiceIdentifier,
    settings.language,
    settings.rate,
    settings.pitch,
  );
}

export async function getAppSettings(db: SQLiteDatabase) {
  return db.getFirstAsync<AppSettings>('SELECT language FROM app_settings WHERE id = 1');
}

export async function updateAppSettings(db: SQLiteDatabase, settings: AppSettings) {
  await db.runAsync(
    `INSERT INTO app_settings (id, language) VALUES (1, ?)
      ON CONFLICT(id) DO UPDATE SET language = excluded.language`,
    settings.language,
  );
}
