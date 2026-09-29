import { ActivityIndicator, ScrollView, View } from 'react-native';

import { PageHeader } from '@/shared/design-system/components/PageHeader';
import { PrimaryButton } from '@/shared/design-system/components/PrimaryButton';
import { Screen } from '@/shared/design-system/components/Screen';
import { palette } from '@/shared/design-system/tokens';
import { useI18n } from '@/shared/i18n/I18nContext';

import { AppearancePanel } from './components/AppearancePanel';
import { LanguagePanel } from './components/LanguagePanel';
import { NarrationPanel } from './components/NarrationPanel';
import { useSettingsViewModel } from './hooks/useSettingsViewModel';
import { styles } from './settings.styles';

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
