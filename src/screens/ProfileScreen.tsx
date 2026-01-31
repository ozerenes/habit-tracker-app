import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHabits } from '@/hooks';
import { useTheme } from '@/theme';
import { SPACING, RADIUS } from '@/theme';

export function ProfileScreen() {
  const theme = useTheme();
  const { habits } = useHabits();

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const activeHabits = habits.length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.textPrimary }]}>Profile</Text>

      <View style={styles.stats}>
        <View style={[styles.stat, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>
            {activeHabits}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Habits
          </Text>
        </View>
        <View style={[styles.stat, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>
            {totalStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Total days
          </Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Your data
        </Text>
        <Text
          style={[styles.sectionText, { color: theme.textSecondary }]}
        >
          All data is stored on your device. Sync will be available in a future
          update.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: SPACING.xxl + 60,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  stat: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    marginTop: SPACING.xs,
  },
  section: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
