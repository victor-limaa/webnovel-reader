import { Pressable, Text, View } from 'react-native';

import { clampStepValue } from '../helpers';
import { styles } from '../styles';

type StepperProps = {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

export function Stepper({ label, value, suffix, min, max, step = 1, onChange }: StepperProps) {
  const display = step < 1 ? value.toFixed(2) : value.toFixed(0);

  return (
    <View style={styles.stepper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepperControl}>
        <Pressable style={styles.stepButton} onPress={() => onChange(clampStepValue(value - step, min, max))}>
          <Text style={styles.stepButtonText}>-</Text>
        </Pressable>
        <Text style={styles.stepValue}>{display}{suffix}</Text>
        <Pressable style={styles.stepButton} onPress={() => onChange(clampStepValue(value + step, min, max))}>
          <Text style={styles.stepButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
