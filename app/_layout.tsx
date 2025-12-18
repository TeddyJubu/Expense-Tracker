import { AuthProvider, AlertProvider } from '@/template';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <ExpenseProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack>
          </ExpenseProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
