import type { Novel } from '@/lib/data/types';
import type { PickedChapterDraft } from '@/lib/import/importer';

export type ImportMode = 'files' | 'paste';

export type ImportViewModel = {
  mode: ImportMode;
  setMode: (mode: ImportMode) => void;
  novelTitle: string;
  setNovelTitle: (title: string) => void;
  drafts: PickedChapterDraft[];
  validDrafts: PickedChapterDraft[];
  failedDrafts: number;
  loadingFiles: boolean;
  saving: boolean;
  novels: Novel[];
  selectedNovelId: string | null;
  setSelectedNovelId: (id: string | null) => void;
  manualNovelTitle: string;
  setManualNovelTitle: (title: string) => void;
  manualChapterTitle: string;
  setManualChapterTitle: (title: string) => void;
  manualText: string;
  setManualText: (text: string) => void;
  manualWordCount: number;
  handlePickFiles: () => Promise<void>;
  moveDraft: (id: string, direction: -1 | 1) => void;
  saveFileImport: () => Promise<void>;
  saveManualImport: () => Promise<void>;
  updateDraftTitle: (id: string, title: string) => void;
};
