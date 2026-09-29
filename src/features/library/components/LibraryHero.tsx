import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { palette } from '@/shared/design-system/tokens';
import { useI18n } from '@/shared/i18n/I18nContext';

import { styles } from '../library.styles';

export function LibraryHero() {
  const { t } = useI18n();

  return (
    <View style={styles.hero}>
      <View style={styles.heroText}>
        <Text style={styles.heroTitle}>{t('library.heroTitle')}</Text>
        <Text style={styles.heroBody}>{t('library.heroBody')}</Text>
      </View>
      <View style={styles.heroMark}>
        <Ionicons name="book" size={36} color={palette.panel} />
      </View>
    </View>
  );
}
