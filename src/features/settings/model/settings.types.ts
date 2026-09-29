import type { AppLanguage } from '@/shared/i18n/translations';
import type { AudioSettings, ReaderSettings } from '@/shared/types/domain';

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
