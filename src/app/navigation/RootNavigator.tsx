import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export function RootNavigator() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="novel/[novelId]" options={{ headerShown: false }} />
        <Stack.Screen name="reader/[chapterId]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
