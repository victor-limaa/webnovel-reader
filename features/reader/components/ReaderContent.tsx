import { type RefObject } from 'react';
import { ScrollView, Text, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import type { ReaderSettings } from '@/lib/data/types';

import { styles } from '../styles';
import type { ReaderTheme } from '../types';

type ReaderContentProps = {
  scrollRef: RefObject<ScrollView | null>;
  text: string;
  title: string;
  settings: ReaderSettings;
  theme: ReaderTheme;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEnd: () => Promise<void>;
};

export function ReaderContent({ scrollRef, text, title, settings, theme, onScroll, onScrollEnd }: ReaderContentProps) {
  return (
    <ScrollView
      ref={scrollRef}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      onScroll={onScroll}
      onMomentumScrollEnd={onScrollEnd}
      onScrollEndDrag={onScrollEnd}
      scrollEventThrottle={600}>
      <Text style={[styles.chapterTitle, { color: theme.text }]}>{title}</Text>
      <Text
        style={[
          styles.body,
          {
            color: theme.text,
            fontSize: settings.fontSize,
            lineHeight: Math.round(settings.fontSize * settings.lineHeight),
          },
        ]}>
        {text}
      </Text>
    </ScrollView>
  );
}
