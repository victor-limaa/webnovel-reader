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

export function getEstimatedSpeechOffset({
  baseOffset,
  startedAt,
  rate,
  textLength,
}: {
  baseOffset: number;
  startedAt: number | null;
  rate: number;
  textLength: number;
}) {
  if (!startedAt) {
    return Math.max(0, Math.min(textLength, baseOffset));
  }

  const elapsedSeconds = Math.max(0, (Date.now() - startedAt) / 1000);
  const charsPerSecond = 14 * Math.max(0.5, rate);
  return Math.max(0, Math.min(textLength, Math.floor(baseOffset + elapsedSeconds * charsPerSecond)));
}

export function getSeekOffset({
  currentOffset,
  direction,
  seconds,
  rate,
  textLength,
}: {
  currentOffset: number;
  direction: -1 | 1;
  seconds: number;
  rate: number;
  textLength: number;
}) {
  const charsPerSecond = 14 * Math.max(0.5, rate);
  const delta = Math.round(charsPerSecond * seconds) * direction;
  return Math.max(0, Math.min(textLength, currentOffset + delta));
}
