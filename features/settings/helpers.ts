import * as Speech from 'expo-speech';

export function getVoiceOptions(voices: Speech.Voice[], language: string) {
  const matchingVoices = voices.filter((voice) => voice.language.toLowerCase().startsWith(language.toLowerCase().slice(0, 2)));
  return matchingVoices.length > 0 ? matchingVoices : voices.slice(0, 8);
}

export function clampStepValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}
