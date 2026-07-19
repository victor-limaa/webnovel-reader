import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getReaderSettings, updateReaderSettings as persistReaderSettings } from '@/lib/data/repository';
import type { ReaderSettings } from '@/lib/data/types';
import { readerThemes } from '@/lib/theme/tokens';

type AppThemeContextValue = {
  readerSettings: ReaderSettings;
  theme: (typeof readerThemes)[keyof typeof readerThemes];
  updateReaderSettings: (settings: ReaderSettings) => Promise<void>;
};

const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 20,
  lineHeight: 1.58,
  theme: 'paper',
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(DEFAULT_READER_SETTINGS);

  useEffect(() => {
    getReaderSettings(db).then((settings) => {
      if (settings) {
        setReaderSettings(settings);
      }
    });
  }, [db]);

  const value = useMemo<AppThemeContextValue>(() => ({
    readerSettings,
    theme: readerThemes[readerSettings.theme],
    updateReaderSettings: async (settings) => {
      setReaderSettings(settings);
      await persistReaderSettings(db, settings);
    },
  }), [db, readerSettings]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return context;
}
