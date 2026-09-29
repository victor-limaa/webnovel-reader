import { Pressable, Text, View } from 'react-native';

import { styles } from '../../reader.styles';
import type { DrawerTheme } from './types';

type DrawerHeaderProps = {
  title: string;
  theme: DrawerTheme;
  onClose: () => void;
};

export function DrawerHeader({ title, theme, onClose }: DrawerHeaderProps) {
  return (
    <View style={styles.drawerHeader}>
      <Text style={[styles.drawerTitle, { color: theme.text }]}>{title}</Text>
      <Pressable style={[styles.drawerCloseButton, { backgroundColor: theme.panel }]} onPress={onClose}>
        <Text style={[styles.drawerCloseText, { color: theme.accent }]}>x</Text>
      </Pressable>
    </View>
  );
}
