import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useAppTheme } from '@/shared/design-system/theme/AppThemeContext';
import { palette } from '@/shared/design-system/tokens';

type IconButtonProps = PressableProps & {
  icon: keyof typeof Ionicons.glyphMap;
  tone?: 'light' | 'dark' | 'accent';
};

export function IconButton({ icon, tone = 'light', style, ...props }: IconButtonProps) {
  const { theme } = useAppTheme();
  const backgroundColor = tone === 'light' ? theme.panel : tone === 'accent' ? theme.accent : palette.umberDark;
  const borderColor = tone === 'light' ? theme.line : backgroundColor;
  const iconColor = tone === 'light' ? theme.accent : theme.panel;

  return (
    <Pressable
      accessibilityRole="button"
      style={(state) => [
        styles.button,
        { backgroundColor, borderColor },
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      <Ionicons
        name={icon}
        size={22}
        color={iconColor}
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
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
