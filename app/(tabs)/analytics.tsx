import { View, Text, StyleSheet, ScrollView, useColorScheme, ActivityIndicator, Platform } from 'react-native';
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

  const renderCategoryChart = () => {
    if (Platform.OS === 'web') {
      const sorted = chartData.categoryData.slice().sort((a, b) => b.value - a.value);
      const total = sorted.reduce((sum, item) => sum + item.value, 0);

      return (
        <View style={styles.webChartFallback}>
          {sorted.map(item => (
            <View key={item.name} style={styles.webChartRow}>
              <View style={[styles.webLegendDot, { backgroundColor: item.color }]} />
              <Text
                style={[
                  styles.webChartLabel,
                  { color: isDark ? colors.textSecondaryDark : colors.textSecondary }
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={[styles.webChartValue, { color: isDark ? colors.textDark : colors.text }]}>
                {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
              </Text>
            </View>
          ))}
          <Text style={[styles.webChartNote, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            Charts are not available on web yet.
          </Text>
        </View>
      );
    }

    return (
      <WebView
        source={{ html: pieChartHtml }}
        style={styles.chart}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  const renderDailyChart = () => {
    if (Platform.OS === 'web') {
      const max = Math.max(0, ...chartData.dailyData.map(item => Number(item[1]) || 0));

      return (
        <View style={styles.webChartFallback}>
          {chartData.dailyData.map(([label, value]) => {
            const amount = Number(value) || 0;
            const pct = max > 0 ? Math.max(0, Math.min(100, (amount / max) * 100)) : 0;

            return (
              <View key={label} style={styles.webBarRow}>
                <Text
                  style={[
                    styles.webBarLabel,
                    { color: isDark ? colors.textSecondaryDark : colors.textSecondary }
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
                <View style={[styles.webBarTrack, { backgroundColor: isDark ? colors.borderDark : colors.border }]}>
                  <View style={[styles.webBarFill, { width: `${pct}%` }]} />
                </View>
                <Text style={[styles.webBarValue, { color: isDark ? colors.textDark : colors.text }]}>
                  {Math.round(amount)}
                </Text>
              </View>
            );
          })}
          <Text style={[styles.webChartNote, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            Charts are not available on web yet.
          </Text>
        </View>
      );
    }

    return (
      <WebView
        source={{ html: barChartHtml }}
        style={styles.chart}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

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
                {renderCategoryChart()}
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
                {renderDailyChart()}
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
                    {chartData.categoryData.slice().sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
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
  webChartFallback: {
    paddingVertical: spacing.sm,
  },
  webChartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  webLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  webChartLabel: {
    ...typography.bodySmall,
    flex: 1,
    marginRight: spacing.sm,
  },
  webChartValue: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  webChartNote: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  webBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  webBarLabel: {
    ...typography.caption,
    width: 70,
    marginRight: spacing.sm,
  },
  webBarTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  webBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  webBarValue: {
    ...typography.caption,
    width: 48,
    textAlign: 'right',
    fontWeight: '600',
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
