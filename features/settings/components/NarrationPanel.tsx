import * as Speech from 'expo-speech';
import { Text, View } from 'react-native';

import type { AudioSettings } from '@/lib/data/types';

import { styles } from '../styles';
import { Stepper } from './Stepper';
import { VoiceSelector } from './VoiceSelector';

type NarrationPanelProps = {
  audio: AudioSettings;
  voices: Speech.Voice[];
  onChange: (settings: AudioSettings) => void;
};

export function NarrationPanel({ audio, voices, onChange }: NarrationPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Narracao</Text>
      <Stepper
        label="Velocidade"
        value={Number(audio.rate.toFixed(2))}
        suffix="x"
        min={0.6}
        max={1.4}
        step={0.05}
        onChange={(rate) => onChange({ ...audio, rate })}
      />
      <Stepper
        label="Tom"
        value={Number(audio.pitch.toFixed(2))}
        suffix="x"
        min={0.7}
        max={1.4}
        step={0.05}
        onChange={(pitch) => onChange({ ...audio, pitch })}
      />
      <VoiceSelector audio={audio} voices={voices} onChange={onChange} />
    </View>
  );
}
