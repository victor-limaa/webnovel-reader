import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/shared/components/HapticTab';
import { useAppTheme } from '@/shared/design-system/theme/AppThemeContext';
import { useI18n } from '@/shared/i18n/I18nContext';

export function TabNavigator() {
  const { t } = useI18n();
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarStyle: {
          backgroundColor: theme.panel,
          borderTopColor: theme.line,
        },
        tabBarInactiveTintColor: theme.muted,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.library'),
          tabBarIcon: ({ color }) => <Ionicons size={24} name="library" color={color} />,
        }}
      />
      <Tabs.Screen
        name="import"
        options={{
          title: t('tabs.import'),
          tabBarIcon: ({ color }) => <Ionicons size={24} name="add-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => <Ionicons size={24} name="options" color={color} />,
        }}
      />
    </Tabs>
  );
}
