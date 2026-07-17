import { ActivityIndicator, ScrollView, View } from 'react-native';

import { PageHeader } from '@/components/ui/PageHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { palette } from '@/lib/theme/tokens';

import { AppearancePanel } from './components/AppearancePanel';
import { LanguagePanel } from './components/LanguagePanel';
import { NarrationPanel } from './components/NarrationPanel';
import { useSettingsViewModel } from './hooks/useSettingsViewModel';
import { styles } from './styles';

export function SettingsScreen() {
  const { t } = useI18n();
  const { language, changeLanguage, reader, setReader, audio, setAudio, saving, save } = useSettingsViewModel();

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
        <PageHeader eyebrow={t('settings.eyebrow')} title={t('settings.title')} />
        <LanguagePanel language={language} onChange={changeLanguage} />
        <AppearancePanel reader={reader} onChange={setReader} />
        <NarrationPanel audio={audio} onChange={setAudio} />
        <PrimaryButton title={saving ? t('import.saving') : t('settings.save')} icon="save" onPress={save} disabled={saving} />
      </ScrollView>
    </Screen>
  );
}
