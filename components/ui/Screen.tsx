import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { palette } from '@/lib/theme/tokens';

type ScreenProps = ViewProps & {
  padded?: boolean;
  edges?: Edge[];
  safeAreaStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, padded = true, edges, safeAreaStyle, style, ...props }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, safeAreaStyle]}>
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
