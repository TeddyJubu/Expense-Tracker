import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';

type CategoryDatum = { name: string; value: number; color: string };
type DailyDatum = [string, number];

function formatCurrency(amount: number) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `$${safeAmount.toFixed(2)}`;
}

export function CategoryChart({ data, isDark }: { data: CategoryDatum[]; isDark: boolean }) {
  const sorted = data.slice().sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.fallback}>
      {sorted.map(item => (
        <View key={item.name} style={styles.row}>
          <View style={[styles.legendDot, { backgroundColor: item.color }]} />
          <Text
            style={[styles.label, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[styles.value, { color: isDark ? colors.textDark : colors.text }]}>
            {formatCurrency(item.value)}
          </Text>
          <Text style={[styles.percent, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function DailyChart({ data, isDark }: { data: DailyDatum[]; isDark: boolean }) {
  const max = Math.max(0, ...data.map(item => Number(item[1]) || 0));

  return (
    <View style={styles.fallback}>
      {data.map(([label, value]) => {
        const amount = Number(value) || 0;
        const pct = max > 0 ? Math.max(0, Math.min(100, (amount / max) * 100)) : 0;

        return (
          <View key={label} style={styles.barRow}>
            <Text
              style={[styles.barLabel, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}
              numberOfLines={1}
            >
              {label}
            </Text>
            <View style={[styles.barTrack, { backgroundColor: isDark ? colors.borderDark : colors.border }]}>
              <View style={[styles.barFill, { width: `${pct}%` }]} />
            </View>
            <Text style={[styles.barValue, { color: isDark ? colors.textDark : colors.text }]}>
              {formatCurrency(amount)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    minHeight: 300,
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    flex: 1,
    marginRight: spacing.sm,
  },
  value: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  percent: {
    ...typography.caption,
    width: 40,
    textAlign: 'right',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  barLabel: {
    ...typography.caption,
    width: 70,
    marginRight: spacing.sm,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  barValue: {
    ...typography.caption,
    width: 84,
    textAlign: 'right',
    fontWeight: '600',
  },
});
