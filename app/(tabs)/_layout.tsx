import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Shadcn-inspired Dark Theme with Lime Accents
const THEME = {
  primary: '#a3e635',
  accent: '#a3e635', // Lime
  surface: '#18181b',
  surfaceDark: '#09090b',
  border: '#27272a',
  inactive: '#71717a',
};

const CustomFAB = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: { elevation: 5 },
      }),
    }}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }}
    activeOpacity={0.8}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: THEME.accent,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Ionicons name="add" size={32} color="#09090b" />
    </View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

      {/* Smart FAB in the middle */}
      <Tabs.Screen
        name="add-expense"
        options={{
          title: '',
          tabBarButton: (props) => (
            <CustomFAB
              {...props}
              onPress={() => router.push('/add-expense')}
            />
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
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

