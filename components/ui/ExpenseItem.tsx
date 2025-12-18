import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import type { Expense, Category } from '@/services/database';

interface ExpenseItemProps {
  expense: Expense;
  category?: Category;
  onPress?: () => void;
}

export function ExpenseItem({ expense, category, onPress }: ExpenseItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const categoryColor = category?.color || colors.categoryOther;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.cardDark : colors.card,
        },
        shadows.card
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: categoryColor }]}>
        <Ionicons 
          name={(category?.icon as keyof typeof Ionicons.glyphMap) || 'ellipsis-horizontal'} 
          size={20} 
          color={colors.background} 
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.description, { color: isDark ? colors.textDark : colors.text }]} numberOfLines={1}>
          {expense.description || 'No description'}
        </Text>
        <View style={styles.metadata}>
          <Text style={[styles.category, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            {category?.name || 'Other'}
          </Text>
          <Text style={[styles.dot, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            ·
          </Text>
          <Text style={[styles.date, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            {formattedDate}
          </Text>
          {expense.input_method !== 'manual' && (
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons 
                  name={
                    expense.input_method === 'chat' ? 'chatbubble' :
                    expense.input_method === 'voice' ? 'mic' : 'camera'
                  } 
                  size={10} 
                  color={colors.primary} 
                />
              </View>
            </View>
          )}
        </View>
      </View>
      
      <Text style={[styles.amount, { color: isDark ? colors.textDark : colors.text }]}>
        ${expense.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
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
  description: {
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  category: {
    ...typography.caption,
  },
  dot: {
    ...typography.caption,
  },
  date: {
    ...typography.caption,
  },
  badgeContainer: {
    marginLeft: spacing.xs,
  },
  badge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    ...typography.h3,
    fontWeight: '600',
    marginLeft: spacing.md,
  },
});
