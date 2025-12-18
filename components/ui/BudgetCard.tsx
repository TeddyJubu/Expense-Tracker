import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import type { Category, Budget } from '@/services/database';

interface BudgetCardProps {
  category: Category;
  budget: Budget;
  spent: number;
}

export function BudgetCard({ category, budget, spent }: BudgetCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const budgetAmount = Number(budget.amount);
  const percentage = Math.min((spent / budgetAmount) * 100, 100);
  const remaining = Math.max(budgetAmount - spent, 0);
  const isOverBudget = spent > budgetAmount;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? colors.cardDark : colors.card,
      },
      shadows.card
    ]}>
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
            <Ionicons 
              name={category.icon as keyof typeof Ionicons.glyphMap} 
              size={20} 
              color={colors.background} 
            />
          </View>
          <View>
            <Text style={[styles.categoryName, { color: isDark ? colors.textDark : colors.text }]}>
              {category.name}
            </Text>
            <Text style={[styles.period, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
              {budget.period}
            </Text>
          </View>
        </View>
        
        <View style={styles.amounts}>
          <Text style={[styles.spent, { color: isOverBudget ? colors.error : (isDark ? colors.textDark : colors.text) }]}>
            ${spent.toFixed(2)}
          </Text>
          <Text style={[styles.budgetTotal, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            of ${budgetAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: isDark ? colors.surfaceDark : colors.surface }]}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${percentage}%`,
                backgroundColor: isOverBudget ? colors.error : category.color,
              }
            ]} 
          />
        </View>
        <Text style={[styles.remaining, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
          {isOverBudget ? 'Over budget' : `$${remaining.toFixed(2)} remaining`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    ...typography.bodyMedium,
  },
  period: {
    ...typography.caption,
    textTransform: 'capitalize',
  },
  amounts: {
    alignItems: 'flex-end',
  },
  spent: {
    ...typography.h3,
    fontWeight: '600',
    marginBottom: 2,
  },
  budgetTotal: {
    ...typography.caption,
  },
  progressContainer: {
    gap: spacing.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  remaining: {
    ...typography.caption,
  },
});
