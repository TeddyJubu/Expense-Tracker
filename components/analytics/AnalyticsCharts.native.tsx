import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/constants/theme';

type CategoryDatum = { name: string; value: number; color: string };
type DailyDatum = [string, number];

export function CategoryChart({ data, isDark: _isDark }: { data: CategoryDatum[]; isDark: boolean }) {
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
          const data = ${JSON.stringify(data)};

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

  return (
    <WebView
      source={{ html: pieChartHtml }}
      style={styles.chart}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
}

export function DailyChart({ data, isDark }: { data: DailyDatum[]; isDark: boolean }) {
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
          const data = ${JSON.stringify(data)};

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
                color: '${colors.primary}',
                borderRadius: [8, 8, 0, 0]
              }
            }]
          });

          window.addEventListener('resize', () => chart.resize());
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: barChartHtml }}
      style={styles.chart}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 300,
    backgroundColor: 'transparent',
  },
});
