import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getAudioSettings, updateAudioSettings } from '@/lib/data/repository';
import type { AudioSettings, ReaderSettings } from '@/lib/data/types';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { getSpeechLanguage, type AppLanguage } from '@/lib/i18n/translations';
import { useAppTheme } from '@/lib/theme/AppThemeProvider';

import type { SettingsViewModel } from '../types';

export function useSettingsViewModel(): SettingsViewModel {
  const db = useSQLiteContext();
  const { language, setLanguage, t } = useI18n();
  const { readerSettings, updateReaderSettings } = useAppTheme();
  const [reader, setReaderState] = useState<ReaderSettings | null>(readerSettings);
  const [audio, setAudio] = useState<AudioSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const audioSettings = await getAudioSettings(db);

      setReaderState(readerSettings);
      setAudio(audioSettings ? { ...audioSettings, voiceIdentifier: null } : null);
    }

    load();
  }, [db, readerSettings]);

  function setReader(settings: ReaderSettings) {
    setReaderState(settings);
    updateReaderSettings(settings);
  }

  async function save() {
    if (!reader || !audio) {
      return;
    }

    setSaving(true);
    try {
      await Promise.all([updateReaderSettings(reader), updateAudioSettings(db, audio)]);
      Alert.alert(t('settings.savedTitle'), t('settings.savedMessage'));
    } catch (error) {
      Alert.alert(t('settings.saveErrorTitle'), error instanceof Error ? error.message : t('settings.saveErrorFallback'));
    } finally {
      setSaving(false);
    }
  }

  async function changeLanguage(nextLanguage: AppLanguage) {
    const speechLanguage = getSpeechLanguage(nextLanguage);
    let nextAudio: AudioSettings | null = null;

    setAudio((current) => current ? {
      ...current,
      language: speechLanguage,
      voiceIdentifier: null,
    } : current);
    if (audio) {
      nextAudio = {
        ...audio,
        language: speechLanguage,
        voiceIdentifier: null,
      };
    }

    await setLanguage(nextLanguage);
    if (nextAudio) {
      await updateAudioSettings(db, nextAudio);
    }
  }

  return { language, changeLanguage, reader, setReader, audio, setAudio, saving, save };
}
