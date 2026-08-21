import { useRef, type RefObject } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type TextInputSelectionChangeEventData,
} from 'react-native';

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
  onContentSizeChange: (width: number, height: number) => void;
  onLayout: (event: LayoutChangeEvent) => void;
  onScrollEnd: () => Promise<void>;
  onTextSelection: (start: number, end: number) => void;
  selectionHint: string;
  narrationPositionLabel: string;
};

export function ReaderContent({
  scrollRef,
  text,
  title,
  settings,
  theme,
  onScroll,
  onContentSizeChange,
  onLayout,
  onScrollEnd,
  onTextSelection,
  selectionHint,
  narrationPositionLabel,
}: ReaderContentProps) {
  const userInteractedWithTextRef = useRef(false);

  function handleSelectionChange(event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) {
    if (!userInteractedWithTextRef.current) {
      return;
    }

    const { start, end } = event.nativeEvent.selection;
    onTextSelection(start, end);
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      onScroll={onScroll}
      onContentSizeChange={onContentSizeChange}
      onLayout={onLayout}
      onMomentumScrollEnd={onScrollEnd}
      onScrollEndDrag={onScrollEnd}
      scrollEventThrottle={600}>
      <Text style={[styles.chapterTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.selectionHint, { color: theme.muted }]}>{selectionHint}</Text>
      <Text style={[styles.narrationPosition, { color: theme.accent }]}>{narrationPositionLabel}</Text>
      <TextInput
        value={text}
        multiline
        scrollEnabled={false}
        showSoftInputOnFocus={false}
        selectionColor={theme.accent}
        onChangeText={() => undefined}
        onPressIn={() => {
          userInteractedWithTextRef.current = true;
        }}
        onSelectionChange={handleSelectionChange}
        style={[
          styles.body,
          {
            color: theme.text,
            fontSize: settings.fontSize,
            lineHeight: Math.round(settings.fontSize * settings.lineHeight),
          },
        ]}
      />
    </ScrollView>
  );
}
