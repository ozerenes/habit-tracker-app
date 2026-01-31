/**
 * Basic weekly insights list - accurate, minimal visuals.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { WeeklyInsight } from '@/services';

type WeeklyInsightsProps = {
  insights: WeeklyInsight[];
  loading?: boolean;
};

export function WeeklyInsights({ insights, loading }: WeeklyInsightsProps) {
  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly</Text>
        <Text style={styles.placeholder}>Loading...</Text>
      </View>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weekly</Text>
      {insights.map((w) => (
        <View key={w.weekKey} style={styles.row}>
          <Text style={styles.label}>{w.weekLabel}</Text>
          <Text style={styles.count}>
            {w.daysCompleted}/{w.targetDays} ({Math.round(w.completionRate * 100)}%)
          </Text>
          <View style={styles.barBg}>
            <View
              style={[styles.barFill, { width: `${w.completionRate * 100}%` }]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
    color: '#888',
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  barBg: {
    height: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#2d5a47',
    borderRadius: 2,
  },
});
