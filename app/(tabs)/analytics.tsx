import { View, Text, StyleSheet, ScrollView, useColorScheme, ActivityIndicator } from 'react-native';
import { useMemo } from 'react';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useExpense } from '@/hooks/useExpense';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { expenses, categories, loading } = useExpense();


  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    const dailyTotals: { [key: string]: number } = {};

    expenses.forEach(exp => {
      const category = categories.find(c => c.id === exp.category_id);
      const categoryName = category?.name || 'Other';
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(exp.amount);

      const date = new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyTotals[date] = (dailyTotals[date] || 0) + Number(exp.amount);
    });

    const categoryData = Object.entries(categoryTotals).map(([name, value]) => {
      const category = categories.find(c => c.name === name);
      return { name, value, color: category?.color || colors.categoryOther };
    });

    const dailyData = Object.entries(dailyTotals)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7);

    return { categoryData, dailyData };
  }, [expenses, categories]);

  const pieChartHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
        <style>
          body { margin: 0; padding: 0; background: transparent; }
          #chart { width: 100%; height: 300px; }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          const chart = echarts.init(document.getElementById('chart'));
          const data = ${JSON.stringify(chartData.categoryData)};
          
          chart.setOption({
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            series: [{
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: true,
              itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
              label: { show: true, formatter: '{b}\\n{c}' },
              data: data.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: { color: item.color }
              }))
            }]
          });

          window.addEventListener('resize', () => chart.resize());
        </script>
      </body>
    </html>
  `;

  const barChartHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
        <style>
          body { margin: 0; padding: 0; background: transparent; }
          #chart { width: 100%; height: 300px; }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          const chart = echarts.init(document.getElementById('chart'));
          const data = ${JSON.stringify(chartData.dailyData)};
          
          chart.setOption({
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: {
              type: 'category',
              data: data.map(item => item[0]),
              axisLabel: { color: '${isDark ? colors.textSecondaryDark : colors.textSecondary}' }
            },
            yAxis: {
              type: 'value',
              axisLabel: { color: '${isDark ? colors.textSecondaryDark : colors.textSecondary}' }
            },
            series: [{
              type: 'bar',
              data: data.map(item => item[1]),
              itemStyle: {
                color: '#a3e635',
                borderRadius: [8, 8, 0, 0]
              }
            }]
          });

          window.addEventListener('resize', () => chart.resize());
        </script>
      </body>
    </html>
  `;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(1, insets.top + spacing.md) }]}>
        <Text style={[styles.title, { color: isDark ? colors.textDark : colors.text }]}>
          Analytics
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: Math.max(1, insets.bottom + 80) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {chartData.categoryData.length > 0 ? (
            <>
              <View style={[
                styles.chartCard,
                {
                  backgroundColor: isDark ? colors.cardDark : colors.card,
                  borderColor: isDark ? colors.borderDark : colors.border,
                },
                shadows.card
              ]}>
                <Text style={[styles.chartTitle, { color: isDark ? colors.textDark : colors.text }]}>
                  Spending by Category
                </Text>
                <WebView
                  source={{ html: pieChartHtml }}
                  style={styles.chart}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              <View style={[
                styles.chartCard,
                {
                  backgroundColor: isDark ? colors.cardDark : colors.card,
                  borderColor: isDark ? colors.borderDark : colors.border,
                },
                shadows.card
              ]}>
                <Text style={[styles.chartTitle, { color: isDark ? colors.textDark : colors.text }]}>
                  Daily Spending (Last 7 Days)
                </Text>
                <WebView
                  source={{ html: barChartHtml }}
                  style={styles.chart}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              <View style={[
                styles.insightsCard,
                {
                  backgroundColor: isDark ? colors.cardDark : colors.card,
                  borderColor: isDark ? colors.borderDark : colors.border,
                },
                shadows.card
              ]}>
                <Text style={[styles.chartTitle, { color: isDark ? colors.textDark : colors.text }]}>
                  Quick Insights
                </Text>
                <View style={styles.insightItem}>
                  <Text style={[styles.insightLabel, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
                    Top Category
                  </Text>
                  <Text style={[styles.insightValue, { color: isDark ? colors.textDark : colors.text }]}>
                    {chartData.categoryData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                  </Text>
                </View>
                <View style={styles.insightItem}>
                  <Text style={[styles.insightLabel, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
                    Total Expenses
                  </Text>
                  <Text style={[styles.insightValue, { color: isDark ? colors.textDark : colors.text }]}>
                    {expenses.length}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
                No data to display yet. Add some expenses to see analytics!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  chartCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  chartTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  chart: {
    height: 300,
    backgroundColor: 'transparent',
  },
  insightsCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  insightLabel: {
    ...typography.body,
  },
  insightValue: {
    ...typography.body,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
});
