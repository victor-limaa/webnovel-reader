import { Pressable, Text, View } from 'react-native';

import type { ReaderTheme } from '@/lib/data/types';
import { readerThemes } from '@/lib/theme/tokens';

import { styles } from '../../styles';

type ThemeOption = {
  value: ReaderTheme;
  label: string;
};

type ThemeGridProps = {
  activeTheme: ReaderTheme;
  options: ThemeOption[];
  onThemeChange: (theme: ReaderTheme) => void | Promise<void>;
};

export function ThemeGrid({ activeTheme, options, onThemeChange }: ThemeGridProps) {
  return (
    <View style={styles.drawerThemeGrid}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.drawerThemeCard,
            { backgroundColor: readerThemes[option.value].panel },
            activeTheme === option.value && styles.drawerThemeCardActive,
          ]}
          onPress={() => onThemeChange(option.value)}>
          <Text style={[styles.drawerThemeAa, { color: readerThemes[option.value].text }]}>Aa</Text>
          <Text style={[styles.drawerThemeLabel, { color: readerThemes[option.value].muted }]}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
