import './global.css';
import { AuthProvider, AlertProvider } from '@/template';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <View className="flex-1 bg-background dark">
      <StatusBar style="light" />
      <AlertProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <ExpenseProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#09090b' },
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
              </Stack>
            </ExpenseProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </AlertProvider>
    </View>
  );
}
