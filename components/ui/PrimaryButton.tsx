import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { palette } from '@/lib/theme/tokens';

type PrimaryButtonProps = PressableProps & {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export function PrimaryButton({ title, icon, variant = 'primary', style, disabled, ...props }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        state.pressed && !disabled && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      {icon ? (
        <Ionicons
          name={icon}
          size={19}
          color={variant === 'secondary' || variant === 'ghost' ? palette.umber : palette.panel}
        />
      ) : null}
      <Text style={[styles.text, (variant === 'secondary' || variant === 'ghost') && styles.secondaryText]}>
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
  secondaryText: {
    color: palette.umber,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.78,
  },
});
