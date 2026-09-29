import type { readerThemes } from '@/shared/design-system/tokens';

export type DrawerTheme = (typeof readerThemes)[keyof typeof readerThemes];
