import { createContext, useContext } from 'react';

import type { readerThemes } from '@/shared/design-system/tokens';
import type { ReaderSettings } from '@/shared/types/domain';

export type AppThemeContextValue = {
  readerSettings: ReaderSettings;
  theme: (typeof readerThemes)[keyof typeof readerThemes];
  updateReaderSettings: (settings: ReaderSettings) => Promise<void>;
};

export const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return context;
}
