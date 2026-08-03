import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

import { countWords, createId, normalizeText, saveChapterText } from '@/lib/files/text-storage';
import { extractPdfText } from '@/lib/import/pdf';

export type PickedChapterDraft = {
  id: string;
  title: string;
  chapterNumber: number;
  sourceType: 'txt' | 'pdf';
  originalFileName: string;
  text: string;
  wordCount: number;
  error?: string;
};

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
  const result = await DocumentPicker.getDocumentAsync({
    type: ['text/plain', 'application/pdf'],
    multiple: true,
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return [];
  }

  const orderedAssets = [...result.assets].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const drafts: PickedChapterDraft[] = [];

  for (const [index, asset] of orderedAssets.entries()) {
    const extension = getExtension(asset.name);
    const sourceType = extension === 'pdf' || asset.mimeType === 'application/pdf' ? 'pdf' : 'txt';

    try {
      const rawText = sourceType === 'pdf' ? await extractPdfText(asset.uri) : await new File(asset.uri).text();
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
