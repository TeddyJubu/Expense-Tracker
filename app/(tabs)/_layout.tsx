import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// Shadcn-inspired Dark Theme with Lime Accents
const THEME = {
  primary: '#a3e635',
  accent: '#a3e635', // Lime
  surface: '#18181b',
  surfaceDark: '#09090b',
  border: '#27272a',
  inactive: '#71717a',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.accent,
        tabBarInactiveTintColor: THEME.inactive,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: Platform.select({ ios: 'rgba(24, 24, 27, 0.95)', default: '#18181b' }),
          borderTopWidth: 1,
          borderTopColor: '#27272a',
          height: Platform.select({ ios: 85, default: 65 }), // Taller for premium feel
          paddingTop: 10,
          paddingBottom: Platform.select({ ios: 25, default: 10 }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "pie-chart" : "pie-chart-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "wallet" : "wallet-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
