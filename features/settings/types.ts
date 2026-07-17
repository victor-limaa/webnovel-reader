import type { AudioSettings, ReaderSettings } from '@/lib/data/types';
import type { AppLanguage } from '@/lib/i18n/translations';

export type SettingsViewModel = {
  language: AppLanguage;
  changeLanguage: (language: AppLanguage) => Promise<void>;
  reader: ReaderSettings | null;
  setReader: (settings: ReaderSettings) => void;
  audio: AudioSettings | null;
  setAudio: (settings: AudioSettings) => void;
  saving: boolean;
  save: () => Promise<void>;
};
