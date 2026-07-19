import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { styles } from '../../styles';
import type { DrawerTheme } from './types';

type QuickControlsProps = {
  fontSize: number;
  brightness: number;
  theme: DrawerTheme;
  onFontSizeChange: (fontSize: number) => void | Promise<void>;
  onBrightnessChange: (brightness: number) => void | Promise<void>;
};

export function QuickControls({
  fontSize,
  brightness,
  theme,
  onFontSizeChange,
  onBrightnessChange,
}: QuickControlsProps) {
  return (
    <View style={styles.drawerQuickControls}>
      <View style={[styles.drawerPillControl, { backgroundColor: theme.panel }]}>
        <Pressable style={styles.drawerPillButton} onPress={() => onFontSizeChange(Math.max(16, fontSize - 1))}>
          <Text style={[styles.drawerPillText, { color: theme.text }]}>A</Text>
        </Pressable>
        <Pressable style={styles.drawerPillButton} onPress={() => onFontSizeChange(Math.min(30, fontSize + 1))}>
          <Text style={[styles.drawerPillTextLarge, { color: theme.text }]}>A</Text>
        </Pressable>
      </View>

      <View style={[styles.drawerPillControl, { backgroundColor: theme.panel }]}>
        <Pressable style={styles.drawerPillButton} onPress={() => onBrightnessChange(Math.max(0.35, brightness - 0.05))}>
          <Ionicons name="sunny-outline" size={19} color={theme.text} />
        </Pressable>
        <Pressable style={styles.drawerPillButton} onPress={() => onBrightnessChange(Math.min(1, brightness + 0.05))}>
          <Ionicons name="sunny" size={21} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}
