import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { styles } from '../styles';
import type { ReaderTheme } from '../types';

type ReaderPlayerProps = {
  isSpeaking: boolean;
  theme: ReaderTheme;
  onPlay: () => Promise<void>;
  onPause: () => Promise<void>;
  onMoveAudio: (direction: -1 | 1) => Promise<void>;
};

export function ReaderPlayer({
  isSpeaking,
  theme,
  onPlay,
  onPause,
  onMoveAudio,
}: ReaderPlayerProps) {
  return (
    <View style={[styles.player, { backgroundColor: theme.panel, borderTopColor: theme.line }]}>
      <Pressable style={styles.navButton} onPress={() => onMoveAudio(-1)}>
        <Ionicons name="play-back" size={22} color={theme.accent} />
      </Pressable>
      <Pressable style={[styles.playButton, { backgroundColor: theme.accent }]} onPress={isSpeaking ? onPause : onPlay}>
        <Ionicons name={isSpeaking ? 'pause' : 'play'} size={28} color={theme.panel} />
      </Pressable>
      <Pressable style={styles.navButton} onPress={() => onMoveAudio(1)}>
        <Ionicons name="play-forward" size={22} color={theme.accent} />
      </Pressable>
    </View>
  );
}
