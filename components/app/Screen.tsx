import { SafeAreaView, StyleSheet, View, type ViewProps } from 'react-native';

import { palette } from '@/lib/theme/tokens';

type ScreenProps = ViewProps & {
  padded?: boolean;
};

export function Screen({ children, padded = true, style, ...props }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, padded && styles.padded, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  container: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  padded: {
    paddingHorizontal: 20,
  },
});
