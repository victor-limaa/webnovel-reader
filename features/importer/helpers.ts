import type { PickedChapterDraft } from '@/lib/import/importer';

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
