import type { ReaderTheme } from '@/lib/data/types';
import type { TranslationKey } from '@/lib/i18n/translations';

export const READER_THEME_OPTIONS: { labelKey: TranslationKey; value: ReaderTheme }[] = [
  { labelKey: 'settings.themePaper', value: 'paper' },
  { labelKey: 'settings.themeSepia', value: 'sepia' },
  { labelKey: 'settings.themeNight', value: 'night' },
];
