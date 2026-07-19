import { Modal, Pressable, Text, View } from 'react-native';

import type { AudioSettings, ReaderSettings, ReaderTheme } from '@/lib/data/types';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { readerThemes } from '@/lib/theme/tokens';

import { styles } from '../styles';
import { AudioSettingsControls } from './reader-settings/AudioSettingsControls';
import { DrawerHeader } from './reader-settings/DrawerHeader';
import { DrawerStepper } from './reader-settings/DrawerStepper';
import { QuickControls } from './reader-settings/QuickControls';
import { ThemeGrid } from './reader-settings/ThemeGrid';

type ReaderSettingsDrawerProps = {
  visible: boolean;
  settings: ReaderSettings;
  audioSettings: AudioSettings | null;
  brightness: number;
  onClose: () => void;
  onThemeChange: (theme: ReaderTheme) => Promise<void>;
  onFontSizeChange: (fontSize: number) => Promise<void>;
  onBrightnessChange: (brightness: number) => void | Promise<void>;
  onAudioRateChange: (rate: number) => Promise<void>;
  onVoiceChange: (voiceIdentifier: string | null) => Promise<void>;
};

const THEME_OPTIONS: { value: ReaderTheme; labelKey: 'settings.themePaper' | 'settings.themeSepia' | 'settings.themeNight' }[] = [
  { value: 'paper', labelKey: 'settings.themePaper' },
  { value: 'sepia', labelKey: 'settings.themeSepia' },
  { value: 'night', labelKey: 'settings.themeNight' },
];

export function ReaderSettingsDrawer({
  visible,
  settings,
  audioSettings,
  brightness,
  onClose,
  onThemeChange,
  onFontSizeChange,
  onBrightnessChange,
  onAudioRateChange,
  onVoiceChange,
}: ReaderSettingsDrawerProps) {
  const { t } = useI18n();
  const drawerTheme = readerThemes[settings.theme];

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.drawerRoot}>
        <Pressable style={styles.drawerBackdrop} onPress={onClose} />
        <View style={[styles.drawerPanel, { backgroundColor: drawerTheme.background }]}>
          <View style={styles.drawerContent}>
            <DrawerHeader title={t('reader.settings')} theme={drawerTheme} onClose={onClose} />

            <QuickControls
              fontSize={settings.fontSize}
              brightness={brightness}
              theme={drawerTheme}
              onFontSizeChange={onFontSizeChange}
              onBrightnessChange={onBrightnessChange}
            />

            <ThemeGrid
              activeTheme={settings.theme}
              options={THEME_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
              onThemeChange={onThemeChange}
            />

            <DrawerStepper
              label={t('reader.brightness')}
              value={Math.round(brightness * 100)}
              suffix="%"
              min={5}
              max={100}
              step={5}
              theme={drawerTheme}
              onChange={(value) => onBrightnessChange(value / 100)}
            />

            {audioSettings ? (
              <AudioSettingsControls
                audioSettings={audioSettings}
                rateLabel={t('settings.rate')}
                voiceLabel={t('reader.narrationVoice')}
                defaultVoiceLabel={t('settings.deviceDefault')}
                theme={drawerTheme}
                onAudioRateChange={onAudioRateChange}
                onVoiceChange={onVoiceChange}
              />
            ) : null}

            <Pressable style={[styles.drawerDoneButton, { backgroundColor: drawerTheme.panel }]} onPress={onClose}>
              <Text style={[styles.drawerDoneText, { color: drawerTheme.text }]}>{t('common.done')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
