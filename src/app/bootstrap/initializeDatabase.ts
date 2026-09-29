import type { SQLiteDatabase } from 'expo-sqlite';

import { migrateDatabase } from '@/infra/storage/database';

export async function initializeDatabase(database: SQLiteDatabase) {
  await migrateDatabase(database);
}
