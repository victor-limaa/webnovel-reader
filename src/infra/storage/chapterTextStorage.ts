import { Directory, File, Paths } from 'expo-file-system';

const ROOT_DIRECTORY = 'webnovels';

function ensureNovelDirectory(novelId: string) {
  const root = new Directory(Paths.document, ROOT_DIRECTORY);
  root.create({ idempotent: true });

  const novelDirectory = new Directory(root, novelId);
  novelDirectory.create({ idempotent: true, intermediates: true });

  return novelDirectory;
}

export function saveChapterText(novelId: string, chapterId: string, text: string) {
  const novelDirectory = ensureNovelDirectory(novelId);
  const file = new File(novelDirectory, `${chapterId}.txt`);
  file.create({ overwrite: true, intermediates: true });
  file.write(text);
  return file.uri;
}

export async function readChapterText(uri: string) {
  return new File(uri).text();
}
