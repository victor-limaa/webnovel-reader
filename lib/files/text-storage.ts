import { Directory, File, Paths } from 'expo-file-system';

const ROOT_DIRECTORY = 'webnovels';

function ensureNovelDirectory(novelId: string) {
  const root = new Directory(Paths.document, ROOT_DIRECTORY);
  root.create({ idempotent: true });

  const novelDirectory = new Directory(root, novelId);
  novelDirectory.create({ idempotent: true, intermediates: true });

  return novelDirectory;
}

export function createId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

export function saveChapterText(novelId: string, chapterId: string, text: string) {
  const novelDirectory = ensureNovelDirectory(novelId);
  const file = new File(novelDirectory, `${chapterId}.txt`);
  file.create({ overwrite: true, intermediates: true });
  file.write(normalizeText(text));
  return file.uri;
}

export async function readChapterText(uri: string) {
  return new File(uri).text();
}
