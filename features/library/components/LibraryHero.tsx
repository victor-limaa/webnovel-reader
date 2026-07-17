import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { palette } from '@/lib/theme/tokens';

import { styles } from '../styles';

export function LibraryHero() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroText}>
        <Text style={styles.heroTitle}>Leia offline, escute quando quiser.</Text>
        <Text style={styles.heroBody}>TXT, PDF digital e textos colados ficam salvos no dispositivo.</Text>
      </View>
      <View style={styles.heroMark}>
        <Ionicons name="book" size={36} color={palette.panel} />
      </View>
    </View>
  );
}
