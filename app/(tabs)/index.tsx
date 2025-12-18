import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useMemo } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { ExpenseItem, AddExpenseModal } from '@/components';
import { useExpense } from '@/hooks/useExpense';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { expenses, categories, loading } = useExpense();
  const [modalVisible, setModalVisible] = useState(false);


  const stats = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthExpenses = expenses.filter(exp => new Date(exp.date) >= startOfMonth);
    const totalMonth = monthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const avgDaily = totalMonth / today.getDate();

    return {
      total: totalMonth,
      count: monthExpenses.length,
      average: avgDaily,
    };
  }, [expenses]);

  const recentExpenses = useMemo(() => expenses.slice(0, 10), [expenses]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.backgroundDark : colors.surface }]}>
      <View style={[styles.header, { paddingTop: Math.max(1, insets.top + spacing.md), backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        <Text style={[styles.greeting, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>Hello there 👋</Text>
        <Text style={[styles.headerTitle, { color: isDark ? colors.textDark : colors.text }]}>Your Expenses</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: Math.max(1, insets.bottom + 100) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={[styles.statsCard, { backgroundColor: isDark ? colors.cardDark : colors.card }, shadows.card]}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>This Month</Text>
              <Text style={[styles.statValue, { color: isDark ? colors.textDark : colors.text }]}>${stats.total.toFixed(2)}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: isDark ? colors.dividerDark : colors.divider }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>Avg/Day</Text>
              <Text style={[styles.statValue, { color: isDark ? colors.textDark : colors.text }]}>${stats.average.toFixed(2)}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: isDark ? colors.dividerDark : colors.divider }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>Count</Text>
              <Text style={[styles.statValue, { color: isDark ? colors.textDark : colors.text }]}>{stats.count}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? colors.textDark : colors.text }]}>
                Recent transactions
              </Text>
            </View>

            {recentExpenses.length > 0 ? (
              recentExpenses.map(expense => {
                const category = categories.find(c => c.id === expense.category_id);
                return (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    category={category}
                  />
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
                  No expenses yet. Tap the + button to add one!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }, shadows.large]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={28} color={colors.background} />
      </TouchableOpacity>

      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    ...typography.h1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    marginHorizontal: spacing.md,
  },
  statLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h2,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
  },
  emptyState: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
