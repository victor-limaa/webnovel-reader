import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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
