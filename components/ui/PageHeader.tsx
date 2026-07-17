import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/lib/theme/tokens';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
};

export function PageHeader({ eyebrow, title }: PageHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 2,
  },
  eyebrow: {
    color: palette.umber,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.ink,
    fontSize: 34,
    fontWeight: '900',
  },
});
