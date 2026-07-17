import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/lib/theme/tokens';

import { styles } from '../styles';
import type { ImportMode } from '../types';

type ModeSwitchProps = {
  mode: ImportMode;
  onChange: (mode: ImportMode) => void;
};

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <View style={styles.modeSwitch}>
      <Pressable style={[styles.modeButton, mode === 'files' && styles.modeButtonActive]} onPress={() => onChange('files')}>
        <Ionicons name="documents" size={18} color={mode === 'files' ? palette.panel : palette.umber} />
        <Text style={[styles.modeText, mode === 'files' && styles.modeTextActive]}>Arquivos</Text>
      </Pressable>
      <Pressable style={[styles.modeButton, mode === 'paste' && styles.modeButtonActive]} onPress={() => onChange('paste')}>
        <Ionicons name="create" size={18} color={mode === 'paste' ? palette.panel : palette.umber} />
        <Text style={[styles.modeText, mode === 'paste' && styles.modeTextActive]}>Colar texto</Text>
      </Pressable>
    </View>
  );
}
