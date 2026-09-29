import { pickDocuments } from '@/infra/files/documentPicker';
import { extractPdfText } from '@/infra/files/pdf';
import { saveChapterText } from '@/infra/storage/chapterTextStorage';
import { readTextFile } from '@/infra/storage/textFileStorage';
import { createId } from '@/shared/utils/id';
import { countWords, normalizeText } from '@/shared/utils/text';

import type { PickedChapterDraft } from '../model/importer.types';

function getExtension(name: string) {
  const last = name.split('.').pop();
  return last?.toLowerCase() ?? '';
}

function cleanTitleFromFileName(name: string, index: number, getFallbackTitle: (chapterNumber: number) => string) {
  const withoutExtension = name.replace(/\.[^/.]+$/, '');
  const title = withoutExtension.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return title || getFallbackTitle(index + 1);
}

export async function pickChapterFiles(getFallbackTitle: (chapterNumber: number) => string = (chapterNumber) => `Chapter ${chapterNumber}`) {
  const assets = await pickDocuments(['text/plain', 'application/pdf']);
  const orderedAssets = [...assets].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const drafts: PickedChapterDraft[] = [];

  for (const [index, asset] of orderedAssets.entries()) {
    const extension = getExtension(asset.name);
    const sourceType = extension === 'pdf' || asset.mimeType === 'application/pdf' ? 'pdf' : 'txt';

    try {
      const rawText = sourceType === 'pdf' ? await extractPdfText(asset.uri) : await readTextFile(asset.uri);
      const text = normalizeText(rawText);

      if (!text) {
        throw new Error('Arquivo sem texto legivel.');
      }

      drafts.push({
        id: createId('draft'),
        title: cleanTitleFromFileName(asset.name, index, getFallbackTitle),
        chapterNumber: index + 1,
        sourceType,
        originalFileName: asset.name,
        text,
        wordCount: countWords(text),
      });
    } catch (error) {
      drafts.push({
        id: createId('draft'),
        title: cleanTitleFromFileName(asset.name, index, getFallbackTitle),
        chapterNumber: index + 1,
        sourceType,
        originalFileName: asset.name,
        text: '',
        wordCount: 0,
        error: error instanceof Error ? error.message : 'Nao foi possivel ler este arquivo.',
      });
    }
  }

  return drafts;
}

export function persistDraftText(novelId: string, draft: PickedChapterDraft) {
  const chapterId = createId('chapter');
  return {
    id: chapterId,
    novelId,
    title: draft.title,
    chapterNumber: draft.chapterNumber,
    sourceType: draft.sourceType,
    originalFileName: draft.originalFileName,
    textFileUri: saveChapterText(novelId, chapterId, draft.text),
    wordCount: draft.wordCount,
  };
}
