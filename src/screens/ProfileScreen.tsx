import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHabits } from '@/hooks';

export function ProfileScreen() {
  const { habits } = useHabits();

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const activeHabits = habits.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{activeHabits}</Text>
          <Text style={styles.statLabel}>Habits</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalStreak}</Text>
          <Text style={styles.statLabel}>Total Streak Days</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Mode</Text>
        <Text style={styles.sectionText}>
          All data is stored locally. Sync will be available in a future update.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
});
