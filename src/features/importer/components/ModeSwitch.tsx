import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/shared/design-system/tokens';
import { useI18n } from '@/shared/i18n/I18nContext';

import { styles } from '../importer.styles';
import type { ImportMode } from '../model/importer.types';

type ModeSwitchProps = {
  mode: ImportMode;
  onChange: (mode: ImportMode) => void;
};

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  const { t } = useI18n();

  return (
    <View style={styles.modeSwitch}>
      <Pressable style={[styles.modeButton, mode === 'files' && styles.modeButtonActive]} onPress={() => onChange('files')}>
        <Ionicons name="documents" size={18} color={mode === 'files' ? palette.panel : palette.umber} />
        <Text style={[styles.modeText, mode === 'files' && styles.modeTextActive]}>{t('import.files')}</Text>
      </Pressable>
      <Pressable style={[styles.modeButton, mode === 'paste' && styles.modeButtonActive]} onPress={() => onChange('paste')}>
        <Ionicons name="create" size={18} color={mode === 'paste' ? palette.panel : palette.umber} />
        <Text style={[styles.modeText, mode === 'paste' && styles.modeTextActive]}>{t('import.paste')}</Text>
      </Pressable>
    </View>
  );
}
