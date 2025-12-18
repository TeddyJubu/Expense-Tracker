import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useAuth, useAlert } from '@/template';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();


  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      showAlert('Error', error);
    }
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Account Settings', onPress: () => showAlert('Info', 'Coming soon') },
    { icon: 'notifications-outline', title: 'Notifications', onPress: () => showAlert('Info', 'Coming soon') },
    { icon: 'card-outline', title: 'Export Data', onPress: () => showAlert('Info', 'Coming soon') },
    { icon: 'help-circle-outline', title: 'Help & Support', onPress: () => showAlert('Info', 'Coming soon') },
    { icon: 'information-circle-outline', title: 'About', onPress: () => showAlert('Info', 'ExpenseTracker v1.0') },
    { icon: 'shield-checkmark-outline', title: 'Privacy Policy', onPress: () => router.push('/privacy-policy') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(1, insets.top + spacing.md) }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Profile
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: Math.max(1, insets.bottom + 80) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            shadows.card
          ]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: '#09090b' }]}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={[styles.email, { color: colors.text }]}>
              {user?.email || 'user@example.com'}
            </Text>
            {user?.username && (
              <Text style={[styles.username, { color: colors.textSecondary }]}>
                @{user.username}
              </Text>
            )}
          </View>

          <View style={[
            styles.menuCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            shadows.card
          ]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                  { borderBottomColor: colors.border }
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={colors.text}
                />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.background} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={[styles.version, { color: colors.textSecondary }]}>
            ExpenseTracker v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h1,
    color: colors.background,
  },
  email: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  username: {
    ...typography.bodySmall,
  },
  menuCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemText: {
    ...typography.body,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  logoutButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '600',
  },
  version: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
});
