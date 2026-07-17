import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import type { Chapter } from '@/lib/data/types';

import { styles } from '../styles';
import type { ReaderTheme } from '../types';

type ReaderPlayerProps = {
  previous: Chapter | null;
  next: Chapter | null;
  isSpeaking: boolean;
  theme: ReaderTheme;
  onPlay: () => Promise<void>;
  onStop: () => Promise<void>;
  onMoveAudio: (direction: -1 | 1) => Promise<void>;
  onOpenChapter: (chapter: Chapter | null) => void;
};

export function ReaderPlayer({
  previous,
  next,
  isSpeaking,
  theme,
  onPlay,
  onStop,
  onMoveAudio,
  onOpenChapter,
}: ReaderPlayerProps) {
  return (
    <View style={[styles.player, { backgroundColor: theme.panel, borderTopColor: theme.line }]}>
      <Pressable disabled={!previous} style={[styles.navButton, !previous && styles.disabled]} onPress={() => onOpenChapter(previous)}>
        <Ionicons name="play-skip-back" size={22} color={theme.accent} />
      </Pressable>
      <Pressable style={styles.navButton} onPress={() => onMoveAudio(-1)}>
        <Ionicons name="play-back" size={22} color={theme.accent} />
      </Pressable>
      <Pressable style={[styles.playButton, { backgroundColor: theme.accent }]} onPress={isSpeaking ? onStop : onPlay}>
        <Ionicons name={isSpeaking ? 'stop' : 'play'} size={28} color={theme.panel} />
      </Pressable>
      <Pressable style={styles.navButton} onPress={() => onMoveAudio(1)}>
        <Ionicons name="play-forward" size={22} color={theme.accent} />
      </Pressable>
      <Pressable disabled={!next} style={[styles.navButton, !next && styles.disabled]} onPress={() => onOpenChapter(next)}>
        <Ionicons name="play-skip-forward" size={22} color={theme.accent} />
      </Pressable>
    </View>
  );
}
