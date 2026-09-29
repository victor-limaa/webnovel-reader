import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/design-system/components/PrimaryButton';
import { palette } from '@/shared/design-system/tokens';
import { useI18n } from '@/shared/i18n/I18nContext';

import { styles } from '../importer.styles';
import type { ImportViewModel } from '../model/importer.types';
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
  const { t } = useI18n();

  return (
    <View style={styles.panel}>
      <Field
        label={t('import.novelTitle')}
        value={novelTitle}
        onChangeText={setNovelTitle}
        placeholder={t('import.novelTitlePlaceholder')}
      />

      <PrimaryButton
        title={loadingFiles ? t('import.readingFiles') : t('import.pickFiles')}
        icon="folder-open"
        onPress={handlePickFiles}
        disabled={loadingFiles || saving}
      />

      {loadingFiles ? <ActivityIndicator color={palette.umber} /> : null}

      {drafts.length > 0 ? (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {t('import.validChapters', { count: validDrafts.length })}
            {failedDrafts > 0 ? t('import.failedChapters', { count: failedDrafts }) : ''}
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
        title={saving ? t('import.saving') : t('import.saveNovel')}
        icon="checkmark"
        onPress={saveFileImport}
        disabled={saving || validDrafts.length === 0}
      />
    </View>
  );
}
