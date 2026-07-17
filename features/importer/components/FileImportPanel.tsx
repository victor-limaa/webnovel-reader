import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { palette } from '@/lib/theme/tokens';

import { styles } from '../styles';
import type { ImportViewModel } from '../types';
import { DraftCard } from './DraftCard';
import { Field } from './Field';

type FileImportPanelProps = Pick<
  ImportViewModel,
  | 'novelTitle'
  | 'setNovelTitle'
  | 'loadingFiles'
  | 'saving'
  | 'drafts'
  | 'validDrafts'
  | 'failedDrafts'
  | 'handlePickFiles'
  | 'moveDraft'
  | 'saveFileImport'
  | 'updateDraftTitle'
>;

export function FileImportPanel({
  novelTitle,
  setNovelTitle,
  loadingFiles,
  saving,
  drafts,
  validDrafts,
  failedDrafts,
  handlePickFiles,
  moveDraft,
  saveFileImport,
  updateDraftTitle,
}: FileImportPanelProps) {
  return (
    <View style={styles.panel}>
      <Field
        label="Titulo da webnovel"
        value={novelTitle}
        onChangeText={setNovelTitle}
        placeholder="Ex.: Lord of the Mysteries"
      />

      <PrimaryButton
        title={loadingFiles ? 'Lendo arquivos...' : 'Selecionar TXT/PDF'}
        icon="folder-open"
        onPress={handlePickFiles}
        disabled={loadingFiles || saving}
      />

      {loadingFiles ? <ActivityIndicator color={palette.umber} /> : null}

      {drafts.length > 0 ? (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {validDrafts.length} capitulos validos
            {failedDrafts > 0 ? `, ${failedDrafts} com erro` : ''}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={drafts}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.draftList}
        renderItem={({ item, index }) => (
          <DraftCard draft={item} index={index} onMove={moveDraft} onTitleChange={updateDraftTitle} />
        )}
      />

      <PrimaryButton
        title={saving ? 'Salvando...' : 'Salvar webnovel'}
        icon="checkmark"
        onPress={saveFileImport}
        disabled={saving || validDrafts.length === 0}
      />
    </View>
  );
}
