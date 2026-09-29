import type { TranslationKey } from '@/shared/i18n/translations';

import type { PickedChapterDraft } from './importer.types';

export function getInitialNovelTitle(draft?: PickedChapterDraft) {
  return draft?.originalFileName?.replace(/\.[^/.]+$/, '') || '';
}

export function reorderDrafts(drafts: PickedChapterDraft[], id: string, direction: -1 | 1) {
  const index = drafts.findIndex((draft) => draft.id === id);
  const nextIndex = index + direction;

  if (index < 0 || nextIndex < 0 || nextIndex >= drafts.length) {
    return drafts;
  }

  const copy = [...drafts];
  const [draft] = copy.splice(index, 1);
  copy.splice(nextIndex, 0, draft);
  return copy.map((item, itemIndex) => ({ ...item, chapterNumber: itemIndex + 1 }));
}

export function getDraftErrorMessage(
  error: string,
  t: (key: TranslationKey) => string,
) {
  if (error === 'Arquivo sem texto legivel.') {
    return t('import.emptyFile');
  }

  if (error === 'Nao foi possivel ler este arquivo.') {
    return t('import.fileReadError');
  }

  if (error.startsWith('Este PDF nao possui texto extraivel.')) {
    return t('import.pdfNoText');
  }

  return error;
}
