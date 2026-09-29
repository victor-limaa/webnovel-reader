import { useSQLiteContext } from 'expo-sqlite';

/** Supplies the configured database without leaking the provider API to features. */
export function useDatabase() {
  return useSQLiteContext();
}
