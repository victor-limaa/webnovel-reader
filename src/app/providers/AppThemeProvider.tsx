import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { getReaderSettings, updateReaderSettings as persistReaderSettings } from '@/features/settings/api/settings.repository';
import { useDatabase } from '@/infra/storage/useDatabase';
import { AppThemeContext, type AppThemeContextValue } from '@/shared/design-system/theme/AppThemeContext';
import { readerThemes } from '@/shared/design-system/tokens';
import type { ReaderSettings } from '@/shared/types/domain';

const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 20,
  lineHeight: 1.58,
  theme: 'paper',
};

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const db = useDatabase();
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
