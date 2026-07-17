import * as Speech from 'expo-speech';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getAudioSettings, getReaderSettings, updateAudioSettings, updateReaderSettings } from '@/lib/data/repository';
import type { AudioSettings, ReaderSettings } from '@/lib/data/types';

import type { SettingsViewModel } from '../types';

export function useSettingsViewModel(): SettingsViewModel {
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

  return { reader, setReader, audio, setAudio, voices, saving, save };
}
