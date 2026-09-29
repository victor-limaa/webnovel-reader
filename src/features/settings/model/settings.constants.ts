import type { TranslationKey } from '@/shared/i18n/translations';
import type { ReaderTheme } from '@/shared/types/domain';

export const READER_THEME_OPTIONS: { labelKey: TranslationKey; value: ReaderTheme }[] = [
  { labelKey: 'settings.themePaper', value: 'paper' },
  { labelKey: 'settings.themeSepia', value: 'sepia' },
  { labelKey: 'settings.themeNight', value: 'night' },
];
