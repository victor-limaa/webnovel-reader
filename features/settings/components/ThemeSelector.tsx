import { Pressable, Text, View } from 'react-native';

import type { ReaderTheme } from '@/lib/data/types';
import { readerThemes } from '@/lib/theme/tokens';

import { READER_THEME_OPTIONS } from '../constants';
import { styles } from '../styles';

type ThemeSelectorProps = {
  value: ReaderTheme;
  onChange: (value: ReaderTheme) => void;
};

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <>
      <Text style={styles.label}>Tema</Text>
      <View style={styles.segment}>
        {READER_THEME_OPTIONS.map((theme) => (
          <Pressable
            key={theme.value}
            style={[
              styles.segmentButton,
              value === theme.value && { backgroundColor: readerThemes[theme.value].accent },
            ]}
            onPress={() => onChange(theme.value)}>
            <Text style={[styles.segmentText, value === theme.value && styles.segmentTextActive]}>{theme.label}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
