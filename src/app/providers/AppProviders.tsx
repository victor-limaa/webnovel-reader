import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { DATABASE_NAME } from '@/app/config/database';
import { initializeDatabase } from '@/app/bootstrap/initializeDatabase';
import { palette } from '@/shared/design-system/tokens';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

import { AppThemeProvider } from './AppThemeProvider';
import { I18nProvider } from './I18nProvider';

export function AppProviders({ children }: { children: ReactNode }) {
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
          <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase} useSuspense>
            <AppThemeProvider>
              <I18nProvider>{children}</I18nProvider>
            </AppThemeProvider>
          </SQLiteProvider>
        </Suspense>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
