import * as DocumentPicker from 'expo-document-picker';

export async function pickDocuments(type: string | string[]) {
  const result = await DocumentPicker.getDocumentAsync({
    type,
    multiple: true,
    copyToCacheDirectory: true,
  });

  return result.canceled ? [] : result.assets;
}
