import * as Speech from 'expo-speech';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/app/PrimaryButton';
import { Screen } from '@/components/app/Screen';
import { getAudioSettings, getReaderSettings, updateAudioSettings, updateReaderSettings } from '@/lib/data/repository';
import type { AudioSettings, ReaderSettings, ReaderTheme } from '@/lib/data/types';
import { palette, readerThemes, shadows } from '@/lib/theme/tokens';

const themes: { label: string; value: ReaderTheme }[] = [
  { label: 'Papel', value: 'paper' },
  { label: 'Sepia', value: 'sepia' },
  { label: 'Noite', value: 'night' },
];

export function SettingsScreen() {
  const db = useSQLiteContext();
  const [reader, setReader] = useState<ReaderSettings | null>(null);
  const [audio, setAudio] = useState<AudioSettings | null>(null);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [readerSettings, audioSettings, availableVoices] = await Promise.all([
        getReaderSettings(db),
        getAudioSettings(db),
        Speech.getAvailableVoicesAsync().catch(() => []),
      ]);

      setReader(readerSettings);
      setAudio(audioSettings);
      setVoices(availableVoices);
    }

    load();
  }, [db]);

  async function save() {
    if (!reader || !audio) {
      return;
    }

    setSaving(true);
    try {
      await Promise.all([updateReaderSettings(db, reader), updateAudioSettings(db, audio)]);
      Alert.alert('Ajustes salvos', 'As preferencias serao usadas nas proximas leituras.');
    } catch (error) {
      Alert.alert('Erro ao salvar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (!reader || !audio) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={palette.umber} />
        </View>
      </Screen>
    );
  }

  const matchingVoices = voices.filter((voice) => voice.language.toLowerCase().startsWith(audio.language.toLowerCase().slice(0, 2)));
  const voiceOptions = matchingVoices.length > 0 ? matchingVoices : voices.slice(0, 8);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Leitura local</Text>
          <Text style={styles.title}>Ajustes</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Aparencia</Text>
          <Text style={styles.label}>Tema</Text>
          <View style={styles.segment}>
            {themes.map((theme) => (
              <Pressable
                key={theme.value}
                style={[
                  styles.segmentButton,
                  reader.theme === theme.value && { backgroundColor: readerThemes[theme.value].accent },
                ]}
                onPress={() => setReader({ ...reader, theme: theme.value })}>
                <Text style={[styles.segmentText, reader.theme === theme.value && styles.segmentTextActive]}>{theme.label}</Text>
              </Pressable>
            ))}
          </View>

          <Stepper
            label="Tamanho da fonte"
            value={reader.fontSize}
            suffix="px"
            min={16}
            max={28}
            onChange={(fontSize) => setReader({ ...reader, fontSize })}
          />
          <Stepper
            label="Altura da linha"
            value={Number(reader.lineHeight.toFixed(2))}
            suffix="x"
            min={1.35}
            max={1.9}
            step={0.05}
            onChange={(lineHeight) => setReader({ ...reader, lineHeight })}
          />
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Narracao</Text>
          <Stepper
            label="Velocidade"
            value={Number(audio.rate.toFixed(2))}
            suffix="x"
            min={0.6}
            max={1.4}
            step={0.05}
            onChange={(rate) => setAudio({ ...audio, rate })}
          />
          <Stepper
            label="Tom"
            value={Number(audio.pitch.toFixed(2))}
            suffix="x"
            min={0.7}
            max={1.4}
            step={0.05}
            onChange={(pitch) => setAudio({ ...audio, pitch })}
          />

          <Text style={styles.label}>Voz</Text>
          <View style={styles.voiceList}>
            <Pressable
              style={[styles.voiceOption, audio.voiceIdentifier === null && styles.voiceOptionActive]}
              onPress={() => setAudio({ ...audio, voiceIdentifier: null })}>
              <Text style={[styles.voiceText, audio.voiceIdentifier === null && styles.voiceTextActive]}>Padrao do dispositivo</Text>
            </Pressable>
            {voiceOptions.map((voice) => (
              <Pressable
                key={voice.identifier}
                style={[styles.voiceOption, audio.voiceIdentifier === voice.identifier && styles.voiceOptionActive]}
                onPress={() => setAudio({ ...audio, voiceIdentifier: voice.identifier, language: voice.language })}>
                <Text style={[styles.voiceText, audio.voiceIdentifier === voice.identifier && styles.voiceTextActive]} numberOfLines={1}>
                  {voice.name} · {voice.language}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <PrimaryButton title={saving ? 'Salvando...' : 'Salvar ajustes'} icon="save" onPress={save} disabled={saving} />
      </ScrollView>
    </Screen>
  );
}

function Stepper({
  label,
  value,
  suffix,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const display = step < 1 ? value.toFixed(2) : value.toFixed(0);

  return (
    <View style={styles.stepper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepperControl}>
        <Pressable style={styles.stepButton} onPress={() => onChange(Math.max(min, Number((value - step).toFixed(2))))}>
          <Text style={styles.stepButtonText}>-</Text>
        </Pressable>
        <Text style={styles.stepValue}>{display}{suffix}</Text>
        <Pressable style={styles.stepButton} onPress={() => onChange(Math.min(max, Number((value + step).toFixed(2))))}>
          <Text style={styles.stepButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingTop: 18,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    gap: 2,
  },
  eyebrow: {
    color: palette.umber,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: palette.ink,
    fontSize: 34,
    fontWeight: '900',
  },
  panel: {
    gap: 14,
    padding: 16,
    borderRadius: 8,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
    ...shadows.lifted,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  label: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  segment: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    borderRadius: 8,
    backgroundColor: palette.paperDeep,
  },
  segmentButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    color: palette.umber,
    fontWeight: '900',
  },
  segmentTextActive: {
    color: palette.panel,
  },
  stepper: {
    gap: 8,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFDF8',
    padding: 6,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.paperDeep,
  },
  stepButtonText: {
    color: palette.umber,
    fontSize: 24,
    fontWeight: '900',
  },
  stepValue: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  voiceList: {
    gap: 8,
  },
  voiceOption: {
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFDF8',
  },
  voiceOptionActive: {
    backgroundColor: palette.umber,
    borderColor: palette.umber,
  },
  voiceText: {
    color: palette.umber,
    fontWeight: '800',
  },
  voiceTextActive: {
    color: palette.panel,
  },
});
