import { ActivityIndicator, ScrollView, View } from 'react-native';

import { PageHeader } from '@/components/ui/PageHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { palette } from '@/lib/theme/tokens';

import { AppearancePanel } from './components/AppearancePanel';
import { NarrationPanel } from './components/NarrationPanel';
import { useSettingsViewModel } from './hooks/useSettingsViewModel';
import { styles } from './styles';

export function SettingsScreen() {
  const { reader, setReader, audio, setAudio, voices, saving, save } = useSettingsViewModel();

  if (!reader || !audio) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={palette.umber} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <PageHeader eyebrow="Leitura local" title="Ajustes" />
        <AppearancePanel reader={reader} onChange={setReader} />
        <NarrationPanel audio={audio} voices={voices} onChange={setAudio} />
        <PrimaryButton title={saving ? 'Salvando...' : 'Salvar ajustes'} icon="save" onPress={save} disabled={saving} />
      </ScrollView>
    </Screen>
  );
}
