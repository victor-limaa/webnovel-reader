import { Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';

import { styles } from '../styles';
import type { ImportViewModel } from '../types';
import { Field } from './Field';
import { NovelPicker } from './NovelPicker';

type ManualImportPanelProps = Pick<
  ImportViewModel,
  | 'novels'
  | 'selectedNovelId'
  | 'setSelectedNovelId'
  | 'manualNovelTitle'
  | 'setManualNovelTitle'
  | 'manualChapterTitle'
  | 'setManualChapterTitle'
  | 'manualText'
  | 'setManualText'
  | 'manualWordCount'
  | 'saving'
  | 'saveManualImport'
>;

export function ManualImportPanel({
  novels,
  selectedNovelId,
  setSelectedNovelId,
  manualNovelTitle,
  setManualNovelTitle,
  manualChapterTitle,
  setManualChapterTitle,
  manualText,
  setManualText,
  manualWordCount,
  saving,
  saveManualImport,
}: ManualImportPanelProps) {
  return (
    <View style={styles.panel}>
      <NovelPicker novels={novels} selectedNovelId={selectedNovelId} onSelect={setSelectedNovelId} />

      {!selectedNovelId ? (
        <Field
          label="Titulo da webnovel"
          value={manualNovelTitle}
          onChangeText={setManualNovelTitle}
          placeholder="Nome da novel"
        />
      ) : null}
      <Field
        label="Titulo do capitulo"
        value={manualChapterTitle}
        onChangeText={setManualChapterTitle}
        placeholder="Capitulo 1"
      />
      <Field
        label="Texto"
        value={manualText}
        onChangeText={setManualText}
        placeholder="Cole o conteudo aqui..."
        multiline
      />
      <Text style={styles.summaryText}>{manualWordCount} palavras</Text>
      <PrimaryButton
        title={saving ? 'Salvando...' : 'Salvar capitulo'}
        icon="save"
        onPress={saveManualImport}
        disabled={saving}
      />
    </View>
  );
}
