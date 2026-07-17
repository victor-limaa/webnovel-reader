import type { NativeScrollEvent } from 'react-native';

export function getScrollProgress(event: NativeScrollEvent, textLength: number) {
  const { contentOffset, contentSize, layoutMeasurement } = event;
  const maxScroll = Math.max(1, contentSize.height - layoutMeasurement.height);
  const ratio = Math.max(0, Math.min(1, contentOffset.y / maxScroll));

  return {
    ratio,
    offset: Math.floor(textLength * ratio),
  };
}

export function getChunkIndexForOffset(chunks: { end: number }[], charOffset: number, fallbackIndex: number) {
  const chunkIndex = chunks.findIndex((chunk) => chunk.end >= charOffset);
  return chunkIndex >= 0 ? chunkIndex : fallbackIndex;
}
