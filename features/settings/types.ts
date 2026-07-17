import * as Speech from 'expo-speech';

import type { AudioSettings, ReaderSettings } from '@/lib/data/types';

export type SettingsViewModel = {
  reader: ReaderSettings | null;
  setReader: (settings: ReaderSettings) => void;
  audio: AudioSettings | null;
  setAudio: (settings: AudioSettings) => void;
  voices: Speech.Voice[];
  saving: boolean;
  save: () => Promise<void>;
};
