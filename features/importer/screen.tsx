import { ScrollView } from 'react-native';

import { PageHeader } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';

import { FileImportPanel } from './components/FileImportPanel';
import { ManualImportPanel } from './components/ManualImportPanel';
import { ModeSwitch } from './components/ModeSwitch';
import { useImportViewModel } from './hooks/useImportViewModel';
import { styles } from './styles';

export function ImportScreen() {
  const viewModel = useImportViewModel();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <PageHeader eyebrow="Entrada local" title="Importar webnovel" />
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
