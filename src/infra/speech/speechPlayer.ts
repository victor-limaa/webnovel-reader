import * as Speech from 'expo-speech';

import type { AudioSettings } from '@/shared/types/domain';

export type SpeechVoice = Speech.Voice;

export async function getAvailableVoices() {
  return Speech.getAvailableVoicesAsync().catch(() => []);
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
