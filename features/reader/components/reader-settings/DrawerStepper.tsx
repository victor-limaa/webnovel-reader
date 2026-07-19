import { Pressable, Text, View } from 'react-native';

import { styles } from '../../styles';
import type { DrawerTheme } from './types';

type DrawerStepperProps = {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step: number;
  theme: DrawerTheme;
  onChange: (value: number) => void | Promise<void>;
};

export function DrawerStepper({
  label,
  value,
  suffix,
  min,
  max,
  step,
  theme,
  onChange,
}: DrawerStepperProps) {
  const display = step < 1 ? value.toFixed(2) : value.toFixed(0);

  function nextValue(direction: -1 | 1) {
    return Math.max(min, Math.min(max, Number((value + step * direction).toFixed(2))));
  }

  return (
    <View style={styles.drawerSection}>
      <Text style={[styles.drawerLabel, { color: theme.text }]}>{label}</Text>
      <View style={[styles.drawerStepper, { backgroundColor: theme.panel, borderColor: theme.line }]}>
        <Pressable style={[styles.drawerStepButton, { backgroundColor: theme.background }]} onPress={() => onChange(nextValue(-1))}>
          <Text style={[styles.drawerStepText, { color: theme.accent }]}>-</Text>
        </Pressable>
        <Text style={[styles.drawerStepValue, { color: theme.text }]}>{display}{suffix}</Text>
        <Pressable style={[styles.drawerStepButton, { backgroundColor: theme.background }]} onPress={() => onChange(nextValue(1))}>
          <Text style={[styles.drawerStepText, { color: theme.accent }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
