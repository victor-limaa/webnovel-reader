import { File } from 'expo-file-system';

export async function readTextFile(uri: string) {
  return new File(uri).text();
}
