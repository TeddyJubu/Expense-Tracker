import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useMemo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useExpense } from '@/hooks/useExpense';
import { Typography, H1 } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { SimpleLineChart } from '@/components/ui/Chart';
import { AddExpenseModal } from '@/components/feature/AddExpenseModal';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { expenses, categories, loading, fetchExpenses } = useExpense();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  }, [fetchExpenses]);

  const stats = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthExpenses = expenses.filter(exp => new Date(exp.date) >= startOfMonth);
    const totalMonth = monthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    return {
      total: totalMonth,
      count: monthExpenses.length,
    };
  }, [expenses]);

  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  return (
    <View className="flex-1 bg-navy-dark">
      {/* Header Section */}
      <View
        style={{ paddingTop: insets.top + 20, paddingBottom: 20 }}
        className="px-6 z-10"
      >
        <View className="flex-row items-start justify-between">
          <View>
            <Typography variant="body" className="text-text-secondary text-sm font-semibold tracking-widest uppercase mb-1">Good Morning 👋</Typography>
            <H1 className="text-3xl text-text-offwhite font-bold tracking-tight mt-1">Overview</H1>
          </View>
          <TouchableOpacity className="p-2 rounded-full bg-navy-surface border border-navy-border shadow-sm">
            <Ionicons name="ellipsis-horizontal" size={20} color="#b0b0bb" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background-dark"
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor="#a3e635" />
        }
      >
        <View className="px-5 space-y-6">
          {/* Main Stat Card - Hero */}
          <Card className="bg-primary rounded-3xl p-6 shadow-lg shadow-primary/20 relative overflow-hidden">
            <View className="absolute -top-20 -right-20 w-64 h-64 bg-text-offwhite opacity-10 rounded-full blur-3xl"></View>
            <View className="absolute top-20 -left-20 w-32 h-32 bg-lime-green opacity-20 rounded-full blur-xl"></View>
            <View className="relative z-10 flex flex-col items-center text-center pt-2 pb-4">
              <Typography variant="caption" className="text-black/60 text-xs font-semibold tracking-wider uppercase mb-2">Total spent this month</Typography>
              <View className="flex-row items-baseline text-black mb-2">
                <Typography variant="h1" className="text-5xl font-extrabold tracking-tighter font-mono">
                  ${stats.total.toFixed(0)}
                </Typography>
                <Typography className="text-3xl font-bold opacity-70 font-mono">
                  .{stats.total.toFixed(2).split('.')[1]}
                </Typography>
              </View>
              <View className="mt-4 bg-black/10 backdrop-blur-sm px-4 py-1.5 rounded-full flex-row items-center space-x-1.5">
                <Ionicons name="trending-up" size={16} color="#000000" />
                <Typography className="text-sm font-medium text-black">+12% vs last month</Typography>
              </View>
            </View>
          </Card>

          {/* Quick Stats Grid */}
          <View className="grid grid-cols-2 gap-4">
            <Card className="bg-navy-surface rounded-2xl p-4 border border-navy-border shadow-sm flex-col justify-between h-32">
              <View className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Ionicons name="receipt" size={20} color="#a3e635" />
              </View>
              <View>
                <Typography variant="h3" className="text-2xl text-text-offwhite font-bold font-mono mb-1">{stats.count}</Typography>
                <Typography className="text-xs text-text-secondary font-medium uppercase tracking-wide">Unique txns</Typography>
              </View>
            </Card>
            <Card className="bg-navy-surface rounded-2xl p-4 border border-navy-border shadow-sm flex-col justify-between h-32">
              <View className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Ionicons name="warning" size={20} color="#a3e635" />
              </View>
              <View>
                <Typography variant="h3" className="text-2xl text-text-offwhite font-bold font-mono mb-1">$0</Typography>
                <Typography className="text-xs text-text-secondary font-medium uppercase tracking-wide">Over limit</Typography>
              </View>
            </Card>
          </View>

          {/* Activity Chart */}
          <SimpleLineChart
            data={[450, 230, 180, 600, 320, 410, 50]}
            labels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
          />

          {/* Recent Transactions */}
          <View>
            <View className="flex-row justify-between items-center mb-4 px-1">
              <Typography variant="h3" className="font-semibold text-lg text-text-offwhite">Recent</Typography>
              <TouchableOpacity className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                <Typography className="text-primary font-bold text-xs uppercase tracking-wider">View all</Typography>
              </TouchableOpacity>
            </View>

            <View className="space-y-3 pb-20">
              {recentExpenses.length > 0 ? (
                recentExpenses.map(expense => {
                  const category = categories.find(c => c.id === expense.category_id);
                  const getCategoryIcon = (categoryName?: string) => {
                    switch (categoryName?.toLowerCase()) {
                      case 'food':
                      case 'restaurant':
                        return 'restaurant';
                      case 'coffee':
                        return 'cafe';
                      case 'transport':
                      case 'uber':
                        return 'car';
                      case 'shopping':
                        return 'bag';
                      default:
                        return 'receipt';
                    }
                  };

                  return (
                    <Card key={expense.id} className="bg-navy-surface p-4 rounded-2xl flex-row items-center justify-between border border-navy-border shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                      <View className="flex-row items-center gap-4">
                        <View className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Ionicons name={getCategoryIcon(category?.name)} size={20} color="#a3e635" />
                        </View>
                        <View>
                          <Typography className="font-semibold text-sm text-text-offwhite">{expense.description}</Typography>
                          <View className="flex-row items-center gap-1.5 mt-0.5">
                            <Typography className="text-xs text-text-secondary font-sans">{category?.name || 'Other'} • {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Typography>
                          </View>
                        </View>
                      </View>
                      <Typography className="font-bold text-text-offwhite font-mono text-lg">${Number(expense.amount).toFixed(2)}</Typography>
                    </Card>
                  );
                })
              ) : (
                <Card className="items-center py-10 bg-navy-surface border-dashed border border-navy-border">
                  <Typography className="text-text-secondary text-center">No transactions yet.</Typography>
                </Card>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setShowAddExpense(true)}
        className="absolute bottom-24 right-5 bg-primary rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
        style={{
          shadowColor: '#a3e635',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="#0a0a2a" />
      </TouchableOpacity>

      <AddExpenseModal
        visible={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        initialMode="chat"
      />
    </View>
  );
}