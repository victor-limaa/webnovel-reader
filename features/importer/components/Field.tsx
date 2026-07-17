import { Text, TextInput, View } from 'react-native';

import { INPUT_PLACEHOLDER_COLOR } from '../constants';
import { styles } from '../styles';

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
};

export function Field({ label, value, onChangeText, placeholder, multiline }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}
