import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useHabitDetail, useWeeklyInsights } from '@/hooks';
import { HabitCheckIn, WeeklyInsights } from '@/components';

export function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = Array.isArray(id) ? id[0] : id;
  const { habit, checkIns, loading, error, checkIn, isCompleting } = useHabitDetail(habitId);
  const { insights: weeklyInsights, loading: insightsLoading } = useWeeklyInsights(habitId, 8);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const handleCheckIn = async (date: string) => {
    await checkIn(date, 1);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !habit) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Habit not found'}</Text>
      </View>
    );
  }

  const todayCheckIn = checkIns.find((c) => c.date === today);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, { borderColor: habit.color }]}>
        <Text style={styles.icon}>{habit.icon}</Text>
        <Text style={styles.name}>{habit.name}</Text>
        <View style={styles.meta}>
          <Text style={styles.streak}>🔥 {habit.streak} day streak</Text>
          {habit.syncStatus === 'pending' && (
            <Text style={styles.syncPending}>· Pending sync</Text>
          )}
        </View>
        {habit.description && (
          <Text style={styles.description}>{habit.description}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today</Text>
        <HabitCheckIn
          date={today}
          count={todayCheckIn?.count ?? 0}
          checked={!!todayCheckIn}
          onPress={() => handleCheckIn(today)}
          disabled={isCompleting}
          syncStatus={todayCheckIn?.syncStatus}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent</Text>
        {checkIns.length === 0 ? (
          <Text style={styles.emptyText}>No check-ins yet</Text>
        ) : (
          checkIns.slice(0, 14).map((ci) => (
            <HabitCheckIn
              key={ci.id}
              date={ci.date}
              count={ci.count}
              checked={true}
              onPress={() => handleCheckIn(ci.date)}
              disabled={isCompleting}
              syncStatus={ci.syncStatus}
            />
          ))
        )}
      </View>

      <WeeklyInsights insights={weeklyInsights} loading={insightsLoading} />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
  },
  errorText: {
    color: '#e55',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  streak: {
    fontSize: 16,
    color: '#888',
  },
  syncPending: {
    fontSize: 14,
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#555',
    paddingVertical: 16,
  },
});
