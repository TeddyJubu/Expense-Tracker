import { View, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useState, useMemo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useExpense } from '@/hooks/useExpense';
import { Typography, H1, H2, Caption } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { ExpenseItem } from '@/components/ui/ExpenseItem';
import { SimpleLineChart } from '@/components/ui/Chart';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { expenses, categories, loading, fetchExpenses } = useExpense();
  const [refreshing, setRefreshing] = useState(false);

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
    // const avgDaily = totalMonth / today.getDate(); // Keep simple for now

    return {
      total: totalMonth,
      count: monthExpenses.length,
    };
  }, [expenses]);

  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  return (
    <View className="flex-1 bg-background">
      {/* Header Section */}
      <View
        style={{ paddingTop: insets.top + 20, paddingBottom: 20 }}
        className="px-6 bg-card z-10 border-b border-border"
      >
        <Typography variant="body" className="text-muted-foreground mb-1">Good Morning 👋</Typography>
        <H1 className="text-foreground">Overview</H1>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor="#a3e635" />
        }
      >
        <View className="p-6 gap-6">
          {/* Main Stat Card - Hero */}
          <Card className="px-6 py-8 items-center bg-primary shadow-lg rounded-3xl border border-primary/20">
            <Caption className="text-primary-foreground/70 mb-2 uppercase tracking-widest text-xs">Total Spent This Month</Caption>
            <Typography variant="h1" className="text-5xl text-primary-foreground font-bold mb-1">
              ${stats.total.toFixed(0)}<Typography className="text-2xl text-primary-foreground/60">.{stats.total.toFixed(2).split('.')[1]}</Typography>
            </Typography>
            <View className="flex-row items-center bg-primary-foreground/10 px-3 py-1 rounded-full mt-4">
              <Ionicons name="trending-up" color="#09090b" size={14} />
              <Typography className="text-primary-foreground ml-2 text-sm font-medium">+12% vs last month</Typography>
            </View>
          </Card>

          {/* Quick Stats Grid */}
          <View className="flex-row gap-4">
            <Card className="flex-1 p-4 bg-card border border-border items-start">
              <View className="bg-primary/10 p-2 rounded-full mb-3">
                <Ionicons name="receipt" size={20} color="#a3e635" />
              </View>
              <Typography variant="h3" className="text-foreground">{stats.count}</Typography>
              <Caption className="text-muted-foreground">Unique txns</Caption>
            </Card>
            <Card className="flex-1 p-4 bg-card border border-border items-start">
              <View className="bg-warning/10 p-2 rounded-full mb-3">
                <Ionicons name="warning" size={20} color="#eab308" />
              </View>
              <Typography variant="h3" className="text-foreground">$0</Typography>
              <Caption className="text-muted-foreground">Over limit</Caption>
            </Card>
          </View>

          {/* Activity Chart */}
          <SimpleLineChart
            data={[450, 230, 180, 600, 320, 410, 50]} // Dummy data for now, replace with `chartData` later
            labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
          />

          {/* Recent Transactions */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <H2 className="text-foreground">Recent</H2>
              <Typography variant="body" className="text-primary font-medium">View All</Typography>
            </View>

            {recentExpenses.length > 0 ? (
              <View className="gap-3">
                {recentExpenses.map(expense => {
                  const category = categories.find(c => c.id === expense.category_id);
                  return (
                    // Using legacy ExpenseItem but wrapping or restyling if needed. 
                    // ideally we should standardize ExpenseItem to use our new UI system.
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      category={category}
                    />
                  );
                })}
              </View>
            ) : (
              <Card className="items-center py-10 bg-card border-dashed border border-border">
                <Typography className="text-muted-foreground text-center">No transactions yet.</Typography>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => Alert.alert('Add Expense', 'Feature coming soon!')}
        className="absolute bottom-24 right-6 bg-primary rounded-full p-4 shadow-lg active:opacity-80"
        style={{
          shadowColor: '#a3e635',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="#09090b" />
      </TouchableOpacity>
    </View>
  );
}

