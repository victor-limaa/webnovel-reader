import { Pressable, Text, View } from 'react-native';

import { readerThemes } from '@/shared/design-system/tokens';
import { useI18n } from '@/shared/i18n/I18nContext';
import type { ReaderTheme } from '@/shared/types/domain';

import { styles } from '../settings.styles';
import { READER_THEME_OPTIONS } from '../model/settings.constants';

type ThemeSelectorProps = {
  value: ReaderTheme;
  onChange: (value: ReaderTheme) => void;
};

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { t } = useI18n();

  return (
    <>
      <Text style={styles.label}>{t('settings.theme')}</Text>
      <View style={styles.segment}>
        {READER_THEME_OPTIONS.map((theme) => (
          <Pressable
            key={theme.value}
            style={[
              styles.segmentButton,
              value === theme.value && { backgroundColor: readerThemes[theme.value].accent },
            ]}
            onPress={() => onChange(theme.value)}>
            <Text style={[styles.segmentText, value === theme.value && styles.segmentTextActive]}>{t(theme.labelKey)}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
