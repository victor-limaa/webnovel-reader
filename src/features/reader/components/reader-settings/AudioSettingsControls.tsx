import { Pressable, Text, View } from 'react-native';

import type { AudioSettings } from '@/shared/types/domain';

import { styles } from '../../reader.styles';
import type { DrawerTheme } from './types';

const AUDIO_RATE_OPTIONS = [0.5, 0.75, 1, 1.2, 1.5, 1.8, 2];

type AudioSettingsControlsProps = {
  audioSettings: AudioSettings;
  rateLabel: string;
  voiceLabel: string;
  defaultVoiceLabel: string;
  theme: DrawerTheme;
  onAudioRateChange: (rate: number) => void | Promise<void>;
  onVoiceChange: (voiceIdentifier: string | null) => void | Promise<void>;
};

export function AudioSettingsControls({
  audioSettings,
  rateLabel,
  voiceLabel,
  defaultVoiceLabel,
  theme,
  onAudioRateChange,
  onVoiceChange,
}: AudioSettingsControlsProps) {
  return (
    <>
      <View style={styles.drawerSection}>
        <Text style={[styles.drawerLabel, { color: theme.text }]}>{rateLabel}</Text>
        <View style={styles.drawerRateGrid}>
          {AUDIO_RATE_OPTIONS.map((rate) => (
            <Pressable
              key={rate}
              style={[
                styles.drawerRateOption,
                { backgroundColor: theme.panel, borderColor: theme.line },
                audioSettings.rate === rate && { backgroundColor: theme.accent, borderColor: theme.accent },
              ]}
              onPress={() => onAudioRateChange(rate)}>
              <Text style={[styles.drawerRateText, { color: audioSettings.rate === rate ? theme.panel : theme.accent }]}>
                {rate.toFixed(rate % 1 === 0 ? 1 : 2)}x
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.drawerSection}>
        <Text style={[styles.drawerLabel, { color: theme.text }]}>{voiceLabel}</Text>
        <View style={styles.drawerVoiceList}>
          <VoiceOption
            active={audioSettings.voiceIdentifier === null}
            label={`${defaultVoiceLabel} · ${audioSettings.language}`}
            theme={theme}
            onPress={() => onVoiceChange(null)}
          />
        </View>
      </View>
    </>
  );
}

function VoiceOption({
  active,
  label,
  theme,
  onPress,
}: {
  active: boolean;
  label: string;
  theme: DrawerTheme;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.drawerVoiceOption,
        { backgroundColor: theme.panel, borderColor: theme.line },
        active && { backgroundColor: theme.accent, borderColor: theme.accent },
      ]}
      onPress={onPress}>
      <Text style={[styles.drawerVoiceText, { color: active ? theme.panel : theme.accent }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}
