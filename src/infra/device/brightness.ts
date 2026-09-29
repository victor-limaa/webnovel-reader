import * as Brightness from 'expo-brightness';

export async function getBrightness() {
  return Brightness.getSystemBrightnessAsync().catch(() => 1);
}

export async function setBrightness(value: number) {
  const permission = await Brightness.requestPermissionsAsync();

  if (permission.granted) {
    await Brightness.setSystemBrightnessAsync(value);
    return;
  }

  await Brightness.setBrightnessAsync(value);
}
