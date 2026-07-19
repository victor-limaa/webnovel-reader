import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/lib/theme/AppThemeProvider';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
};

export function PageHeader({ eyebrow, title }: PageHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.eyebrow, { color: theme.accent }]}>{eyebrow}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
  },
});
