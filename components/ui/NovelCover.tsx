import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '@/lib/theme/tokens';

type NovelCoverProps = {
  title: string;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
};

export function NovelCover({ title, size = 'small', style }: NovelCoverProps) {
  return (
    <View style={[styles.cover, styles[size], style]}>
      <Text style={[styles.letters, size === 'large' && styles.largeLetters]}>
        {title.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 8,
    backgroundColor: palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    width: 58,
    minHeight: 82,
    borderRadius: 6,
  },
  large: {
    width: 82,
    height: 118,
  },
  letters: {
    color: palette.panel,
    fontSize: 18,
    fontWeight: '900',
  },
  largeLetters: {
    fontSize: 24,
  },
});
