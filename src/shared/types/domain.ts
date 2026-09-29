/** Domain contracts shared by features that read and write the same entities. */
export type SourceType = 'txt' | 'pdf' | 'manual';
export type ReaderTheme = 'paper' | 'night' | 'sepia';
export type AppLanguage = 'pt-BR' | 'en';

export type Novel = {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  chapterCount: number;
  lastChapterTitle: string | null;
  progressChapterId: string | null;
  progressRatio: number | null;
};

export type Chapter = {
  id: string;
  novelId: string;
  title: string;
  chapterNumber: number;
  sourceType: SourceType;
  originalFileName: string | null;
  textFileUri: string;
  wordCount: number;
  createdAt: string;
};

export type ReadingProgress = {
  novelId: string;
  chapterId: string;
  charOffset: number;
  scrollRatio: number;
  updatedAt: string;
};

export type ReaderSettings = {
  fontSize: number;
  lineHeight: number;
  theme: ReaderTheme;
};

export type AudioSettings = {
  voiceIdentifier: string | null;
  language: string;
  rate: number;
  pitch: number;
};

export type AppSettings = {
  language: AppLanguage;
};
