import type { Chapter, ReaderSettings } from '@/lib/data/types';
import type { readerThemes } from '@/lib/theme/tokens';

export type ReaderTheme = (typeof readerThemes)[keyof typeof readerThemes];

export type ReaderHeaderProps = {
  chapter: Chapter;
  theme: ReaderTheme;
  onBack: () => void;
  onOpenChapterList: () => void;
  onOpenSettings: () => void;
};

export type ReaderContentProps = {
  text: string;
  title: string;
  settings: ReaderSettings;
  theme: ReaderTheme;
  onScroll: (event: never) => void;
  onScrollEnd: () => Promise<void>;
};
