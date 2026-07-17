import * as Speech from 'expo-speech';
import { Pressable, Text, View } from 'react-native';

import type { AudioSettings } from '@/lib/data/types';

import { getVoiceOptions } from '../helpers';
import { styles } from '../styles';

type VoiceSelectorProps = {
  audio: AudioSettings;
  voices: Speech.Voice[];
  onChange: (settings: AudioSettings) => void;
};

export function VoiceSelector({ audio, voices, onChange }: VoiceSelectorProps) {
  const voiceOptions = getVoiceOptions(voices, audio.language);

  return (
    <>
      <Text style={styles.label}>Voz</Text>
      <View style={styles.voiceList}>
        <Pressable
          style={[styles.voiceOption, audio.voiceIdentifier === null && styles.voiceOptionActive]}
          onPress={() => onChange({ ...audio, voiceIdentifier: null })}>
          <Text style={[styles.voiceText, audio.voiceIdentifier === null && styles.voiceTextActive]}>Padrao do dispositivo</Text>
        </Pressable>
        {voiceOptions.map((voice) => (
          <Pressable
            key={voice.identifier}
            style={[styles.voiceOption, audio.voiceIdentifier === voice.identifier && styles.voiceOptionActive]}
            onPress={() => onChange({ ...audio, voiceIdentifier: voice.identifier, language: voice.language })}>
            <Text style={[styles.voiceText, audio.voiceIdentifier === voice.identifier && styles.voiceTextActive]} numberOfLines={1}>
              {voice.name} · {voice.language}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
