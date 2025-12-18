import { View, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';

import { useAuth, useAlert } from '@/template';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { signInWithPassword, signUpWithPassword, operationLoading } = useAuth();
  const { showAlert } = useAlert();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        showAlert('Error', 'Passwords do not match');
        return;
      }

      const { error } = await signUpWithPassword(email, password);
      if (error) {
        showAlert('Error', error);
      }
    } else {
      const { error } = await signInWithPassword(email, password);
      if (error) {
        showAlert('Error', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: isDark ? colors.backgroundDark : colors.background, paddingTop: insets.top }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>💰</Text>
          <Text style={[styles.title, { color: isDark ? colors.textDark : colors.text }]}>ExpenseTracker</Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>AI-Powered Expense Management</Text>
        </View>

        <View style={styles.formSection}>
          <View style={[styles.formContainer, { backgroundColor: isDark ? colors.cardDark : colors.card }, shadows.card]}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? colors.cardDark : colors.card,
                  color: isDark ? colors.textDark : colors.text,
                  borderColor: isDark ? colors.borderDark : colors.border,
                }
              ]}
              placeholder="Email"
              placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!operationLoading}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? colors.cardDark : colors.card,
                  color: isDark ? colors.textDark : colors.text,
                  borderColor: isDark ? colors.borderDark : colors.border,
                }
              ]}
              placeholder="Password"
              placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!operationLoading}
            />

            {isSignUp && (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? colors.cardDark : colors.card,
                    color: isDark ? colors.textDark : colors.text,
                    borderColor: isDark ? colors.borderDark : colors.border,
                  }
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!operationLoading}
              />
            )}

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                operationLoading && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={operationLoading}
              activeOpacity={0.8}
            >
              {operationLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.buttonText}>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
            disabled={operationLoading}
          >
            <Text style={[styles.switchText, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
              {isSignUp ? 'Already have an account? ' : "Do not have an account? "}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    fontSize: 72,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
  },
  formSection: {
    gap: spacing.xl,
  },
  formContainer: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
  },
  button: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.bodyMedium,
    color: colors.background,
  },
  switchButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  switchText: {
    ...typography.body,
    textAlign: 'center',
  },
});
