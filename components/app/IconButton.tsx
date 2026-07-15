import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { palette } from '@/lib/theme/tokens';

type IconButtonProps = PressableProps & {
  icon: keyof typeof Ionicons.glyphMap;
  tone?: 'light' | 'dark' | 'accent';
};

export function IconButton({ icon, tone = 'light', style, ...props }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={(state) => [
        styles.button,
        tone === 'dark' && styles.dark,
        tone === 'accent' && styles.accent,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      <Ionicons
        name={icon}
        size={22}
        color={tone === 'light' ? palette.umber : palette.panel}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
  },
  dark: {
    backgroundColor: palette.umberDark,
    borderColor: palette.umberDark,
  },
  accent: {
    backgroundColor: palette.umber,
    borderColor: palette.umber,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
