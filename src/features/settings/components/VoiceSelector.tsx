import { Text, View } from 'react-native';

import { useI18n } from '@/shared/i18n/I18nContext';
import type { AudioSettings } from '@/shared/types/domain';

import { styles } from '../settings.styles';

type VoiceSelectorProps = {
  audio: AudioSettings;
};

export function VoiceSelector({ audio }: VoiceSelectorProps) {
  const { t } = useI18n();

  return (
    <>
      <Text style={styles.label}>{t('settings.ttsVoice')}</Text>
      <View style={styles.voiceList}>
        <View style={[styles.voiceOption, styles.voiceOptionActive]}>
          <Text style={[styles.voiceText, styles.voiceTextActive]} numberOfLines={1}>
            {t('settings.deviceDefault')} · {audio.language}
          </Text>
        </View>
      </View>
    </>
  );
}
