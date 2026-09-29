import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { useAppTheme } from '@/shared/design-system/theme/AppThemeContext';
import { palette } from '@/shared/design-system/tokens';

type PrimaryButtonProps = PressableProps & {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export function PrimaryButton({ title, icon, variant = 'primary', style, disabled, ...props }: PrimaryButtonProps) {
  const { theme } = useAppTheme();
  const isSubtle = variant === 'secondary' || variant === 'ghost';
  const iconColor = isSubtle ? theme.accent : theme.panel;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        styles.button,
        styles[variant],
        variant === 'primary' && { backgroundColor: theme.accent },
        variant === 'secondary' && { backgroundColor: theme.panel, borderColor: theme.line },
        disabled && styles.disabled,
        state.pressed && !disabled && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      {icon ? (
        <Ionicons
          name={icon}
          size={19}
          color={iconColor}
        />
      ) : null}
      <Text style={[styles.text, { color: theme.panel }, isSubtle && { color: theme.accent }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primary: {
    backgroundColor: palette.umber,
  },
  secondary: {
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: palette.danger,
  },
  text: {
    color: palette.panel,
    fontWeight: '800',
    fontSize: 15,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.78,
  },
});
