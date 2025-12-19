import React from 'react';
import { Platform } from 'react-native';

type CategoryDatum = { name: string; value: number; color: string };
type DailyDatum = [string, number];

type CategoryChartProps = { data: CategoryDatum[]; isDark: boolean };
type DailyChartProps = { data: DailyDatum[]; isDark: boolean };

type ChartsModule = {
  CategoryChart: React.ComponentType<CategoryChartProps>;
  DailyChart: React.ComponentType<DailyChartProps>;
};

let cachedCharts: ChartsModule | null = null;

function getCharts(): ChartsModule {
  if (cachedCharts) return cachedCharts;

  cachedCharts = Platform.OS === 'web'
    ? (require('./AnalyticsCharts.web') as ChartsModule)
    : (require('./AnalyticsCharts.native') as ChartsModule);

  return cachedCharts;
}

export function CategoryChart(props: CategoryChartProps) {
  const { CategoryChart } = getCharts();
  return <CategoryChart {...props} />;
}

export function DailyChart(props: DailyChartProps) {
  const { DailyChart } = getCharts();
  return <DailyChart {...props} />;
}

