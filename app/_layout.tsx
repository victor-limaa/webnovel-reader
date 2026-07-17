import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { migrateDatabase } from '@/lib/data/database';
import { palette } from '@/lib/theme/tokens';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Suspense
          fallback={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.paper }}>
              <ActivityIndicator color={palette.umber} />
            </View>
          }>
          <SQLiteProvider databaseName="webnovel-reader.db" onInit={migrateDatabase} useSuspense>
            <I18nProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="novel/[novelId]" options={{ headerShown: false }} />
                <Stack.Screen name="reader/[chapterId]" options={{ headerShown: false }} />
              </Stack>
            </I18nProvider>
          </SQLiteProvider>
        </Suspense>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
