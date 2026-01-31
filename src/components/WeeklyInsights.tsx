import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { WeeklyInsight } from '@/services';
import { useTheme } from '@/theme';
import { SPACING } from '@/theme';

type WeeklyInsightsProps = {
  insights: WeeklyInsight[];
  loading?: boolean;
};

export function WeeklyInsights({ insights, loading }: WeeklyInsightsProps) {
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Last 8 weeks
        </Text>
        <Text style={[styles.placeholder, { color: theme.textTertiary }]}>
          Loading…
        </Text>
      </View>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        Last 8 weeks
      </Text>
      {insights.map((w) => (
        <View key={w.weekKey} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>
              {w.weekLabel}
            </Text>
            <Text style={[styles.fraction, { color: theme.textTertiary }]}>
              {w.daysCompleted}/{w.targetDays}
            </Text>
          </View>
          <View
            style={[
              styles.barBg,
              { backgroundColor: theme.surfaceElevated },
            ]}
          >
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min(100, w.completionRate * 100)}%`,
                  backgroundColor: theme.primaryMuted,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  placeholder: {
    fontSize: 14,
  },
  row: {
    marginBottom: SPACING.md,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  fraction: {
    fontSize: 14,
  },
  barBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
