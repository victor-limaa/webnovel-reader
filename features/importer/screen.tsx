import { ScrollView } from 'react-native';

import { PageHeader } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { useI18n } from '@/lib/i18n/I18nProvider';

import { FileImportPanel } from './components/FileImportPanel';
import { ManualImportPanel } from './components/ManualImportPanel';
import { ModeSwitch } from './components/ModeSwitch';
import { useImportViewModel } from './hooks/useImportViewModel';
import { styles } from './styles';

export function ImportScreen() {
  const viewModel = useImportViewModel();
  const { t } = useI18n();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <PageHeader eyebrow={t('import.eyebrow')} title={t('import.title')} />
        <ModeSwitch mode={viewModel.mode} onChange={viewModel.setMode} />

        {viewModel.mode === 'files' ? (
          <FileImportPanel {...viewModel} />
        ) : (
          <ManualImportPanel {...viewModel} />
        )}
      </ScrollView>
    </Screen>
  );
}
