import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isDark ? colors.cardDark : colors.card,
      },
      shadows.card
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color={colors.background} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
          {title}
        </Text>
        <Text style={[styles.value, { color: isDark ? colors.textDark : colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h2,
    fontWeight: '600',
  },
});
