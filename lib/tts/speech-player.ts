import * as Speech from 'expo-speech';

import type { AudioSettings } from '@/lib/data/types';

const FALLBACK_LIMIT = 3200;

export function splitForSpeech(text: string) {
  const limit = Math.min(Speech.maxSpeechInputLength || FALLBACK_LIMIT, FALLBACK_LIMIT);
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks: { text: string; start: number; end: number }[] = [];
  let cursor = 0;

  for (const paragraph of paragraphs) {
    const paragraphStart = text.indexOf(paragraph, cursor);
    cursor = paragraphStart + paragraph.length;

    if (paragraph.length <= limit) {
      chunks.push({ text: paragraph, start: paragraphStart, end: cursor });
      continue;
    }

    let localOffset = 0;
    while (localOffset < paragraph.length) {
      const candidateEnd = Math.min(localOffset + limit, paragraph.length);
      const slice = paragraph.slice(localOffset, candidateEnd);
      const lastBreak = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '), slice.lastIndexOf('; '));
      const end = candidateEnd < paragraph.length && lastBreak > limit * 0.45 ? localOffset + lastBreak + 1 : candidateEnd;
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

export function speakChunk(
  chunk: string,
  settings: AudioSettings,
  callbacks: { onDone: () => void; onStopped: () => void; onError: (message: string) => void },
) {
  Speech.speak(chunk, {
    language: settings.language,
    rate: settings.rate,
    pitch: settings.pitch,
    voice: settings.voiceIdentifier ?? undefined,
    onDone: callbacks.onDone,
    onStopped: callbacks.onStopped,
    onError: (error) => callbacks.onError(error.message),
  });
}

export async function stopSpeech() {
  await Speech.stop();
}
