type ScrollMetrics = {
  contentOffset: { y: number };
  contentSize: { height: number };
  layoutMeasurement: { height: number };
};

const MAX_SPEECH_CHUNK_LENGTH = 3200;

export function splitForSpeech(text: string) {
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks: { text: string; start: number; end: number }[] = [];
  let cursor = 0;

  for (const paragraph of paragraphs) {
    const paragraphStart = text.indexOf(paragraph, cursor);
    cursor = paragraphStart + paragraph.length;

    if (paragraph.length <= MAX_SPEECH_CHUNK_LENGTH) {
      chunks.push({ text: paragraph, start: paragraphStart, end: cursor });
      continue;
    }

    let localOffset = 0;
    while (localOffset < paragraph.length) {
      const candidateEnd = Math.min(localOffset + MAX_SPEECH_CHUNK_LENGTH, paragraph.length);
      const slice = paragraph.slice(localOffset, candidateEnd);
      const lastBreak = Math.max(
        slice.lastIndexOf('. '),
        slice.lastIndexOf('! '),
        slice.lastIndexOf('? '),
        slice.lastIndexOf('; '),
      );
      const end = candidateEnd < paragraph.length && lastBreak > MAX_SPEECH_CHUNK_LENGTH * 0.45
        ? localOffset + lastBreak + 1
        : candidateEnd;
      const chunkText = paragraph.slice(localOffset, end).trim();

      if (chunkText) {
        chunks.push({
          text: chunkText,
          start: paragraphStart + localOffset,
          end: paragraphStart + end,
        });
      }

      localOffset = end;
    }
  }

  return chunks;
}

export function getScrollProgress(event: ScrollMetrics, textLength: number) {
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
