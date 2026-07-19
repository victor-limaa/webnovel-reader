import type { readerThemes } from '@/lib/theme/tokens';

export type DrawerTheme = (typeof readerThemes)[keyof typeof readerThemes];
