import { Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/design-system/components/PrimaryButton';
import { useI18n } from '@/shared/i18n/I18nContext';

import { styles } from '../importer.styles';
import type { ImportViewModel } from '../model/importer.types';
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
  const { t } = useI18n();

  return (
    <View style={styles.panel}>
      <NovelPicker novels={novels} selectedNovelId={selectedNovelId} onSelect={setSelectedNovelId} />

      {!selectedNovelId ? (
        <Field
          label={t('import.novelTitle')}
          value={manualNovelTitle}
          onChangeText={setManualNovelTitle}
          placeholder={t('import.novelNamePlaceholder')}
        />
      ) : null}
      <Field
        label={t('import.chapterTitle')}
        value={manualChapterTitle}
        onChangeText={setManualChapterTitle}
        placeholder={t('import.chapterTitlePlaceholder')}
      />
      <Field
        label={t('import.text')}
        value={manualText}
        onChangeText={setManualText}
        placeholder={t('import.textPlaceholder')}
        multiline
      />
      <Text style={styles.summaryText}>{t('common.words', { count: manualWordCount })}</Text>
      <PrimaryButton
        title={saving ? t('import.saving') : t('import.saveChapter')}
        icon="save"
        onPress={saveManualImport}
        disabled={saving}
      />
    </View>
  );
}
