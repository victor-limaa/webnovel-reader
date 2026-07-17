import { Text, View } from 'react-native';

import type { ReaderSettings } from '@/lib/data/types';

import { styles } from '../styles';
import { Stepper } from './Stepper';
import { ThemeSelector } from './ThemeSelector';

type AppearancePanelProps = {
  reader: ReaderSettings;
  onChange: (settings: ReaderSettings) => void;
};

export function AppearancePanel({ reader, onChange }: AppearancePanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Aparencia</Text>
      <ThemeSelector value={reader.theme} onChange={(theme) => onChange({ ...reader, theme })} />
      <Stepper
        label="Tamanho da fonte"
        value={reader.fontSize}
        suffix="px"
        min={16}
        max={28}
        onChange={(fontSize) => onChange({ ...reader, fontSize })}
      />
      <Stepper
        label="Altura da linha"
        value={Number(reader.lineHeight.toFixed(2))}
        suffix="x"
        min={1.35}
        max={1.9}
        step={0.05}
        onChange={(lineHeight) => onChange({ ...reader, lineHeight })}
      />
    </View>
  );
}
