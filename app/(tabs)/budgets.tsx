import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { BudgetCard } from '@/components';
import { useExpense } from '@/hooks/useExpense';
import { useAlert } from '@/template';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Category } from '@/services/database';

export default function BudgetsScreen() {
  const insets = useSafeAreaInsets();
  const { expenses, categories, budgets, addBudget, loading } = useExpense();
  const { showAlert } = useAlert();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [amount, setAmount] = useState('');
  const [period] = useState<'monthly'>('monthly');


  const budgetData = useMemo(() => {
    return budgets.map(budget => {
      const category = categories.find(c => c.id === budget.category_id);
      if (!category) return null;

      const categoryExpenses = expenses.filter(exp => exp.category_id === category.id);
      const spent = categoryExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

      return { category, budget, spent };
    }).filter(Boolean);
  }, [budgets, categories, expenses]);

  const handleAddBudget = async () => {
    if (!selectedCategory || !amount) {
      showAlert('Error', 'Please select a category and enter an amount');
      return;
    }

    const existingBudget = budgets.find(b => b.category_id === selectedCategory.id);
    if (existingBudget) {
      showAlert('Error', 'Budget already exists for this category');
      return;
    }

    await addBudget({
      category_id: selectedCategory.id,
      amount: parseFloat(amount),
      period,
    });

    showAlert('Success', 'Budget created successfully');
    setModalVisible(false);
    setSelectedCategory(null);
    setAmount('');
  };

  const availableCategories = categories.filter(
    cat => !budgets.some(b => b.category_id === cat.id)
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(1, insets.top + spacing.md) }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Budgets
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: Math.max(1, insets.bottom + 80) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {budgetData.length > 0 ? (
            budgetData.map((item: any) => (
              <BudgetCard
                key={item.budget.id}
                category={item.category}
                budget={item.budget}
                spent={item.spent}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="wallet-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No budgets set yet. Tap + to create one!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { backgroundColor: colors.background }
          ]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Budget
            </Text>

            <Text style={[styles.label, { color: colors.text, fontWeight: '600' }]}>
              Select Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {availableCategories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: selectedCategory?.id === cat.id ? cat.color : colors.surface,
                      borderColor: cat.color,
                    }
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={cat.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={selectedCategory?.id === cat.id ? colors.background : cat.color}
                  />
                  <Text style={[
                    styles.categoryChipText,
                    {
                      color: selectedCategory?.id === cat.id ? colors.background : colors.text
                    }
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: colors.text, fontWeight: '600' }]}>
              Monthly Budget Amount
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }
              ]}
              placeholder="0.00"
              placeholderTextColor="#71717a"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.surface }]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleAddBudget}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, { color: colors.background }]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  categoryScroll: {
    marginBottom: spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  categoryChipText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
});
