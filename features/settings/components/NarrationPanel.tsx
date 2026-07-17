import { Text, View } from 'react-native';

import type { AudioSettings } from '@/lib/data/types';
import { useI18n } from '@/lib/i18n/I18nProvider';

import { styles } from '../styles';
import { Stepper } from './Stepper';
import { VoiceSelector } from './VoiceSelector';

type NarrationPanelProps = {
  audio: AudioSettings;
  onChange: (settings: AudioSettings) => void;
};

export function NarrationPanel({ audio, onChange }: NarrationPanelProps) {
  const { t } = useI18n();

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{t('settings.narration')}</Text>
      <Stepper
        label={t('settings.rate')}
        value={Number(audio.rate.toFixed(2))}
        suffix="x"
        min={0.6}
        max={1.4}
        step={0.05}
        onChange={(rate) => onChange({ ...audio, rate })}
      />
      <Stepper
        label={t('settings.pitch')}
        value={Number(audio.pitch.toFixed(2))}
        suffix="x"
        min={0.7}
        max={1.4}
        step={0.05}
        onChange={(pitch) => onChange({ ...audio, pitch })}
      />
      <VoiceSelector audio={audio} />
    </View>
  );
}
