import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useAppTheme } from '@/shared/design-system/theme/AppThemeContext';

type ScreenProps = ViewProps & {
  padded?: boolean;
  edges?: Edge[];
  safeAreaStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, padded = true, edges, safeAreaStyle, style, ...props }: ScreenProps) {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor: theme.background }, safeAreaStyle]}>
      <View style={[styles.container, { backgroundColor: theme.background }, padded && styles.padded, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 20,
  },
});
