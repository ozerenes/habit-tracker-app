import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useHabits } from '@/hooks';
import { HabitCard, AddHabitButton } from '@/components';
import { ROUTES } from '@/navigation/routes';

export function HomeScreen() {
  const router = useRouter();
  const { habits, loading, error, refetch } = useHabits();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const todayHabits = habits.slice(0, 5);
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  const handleAddHabit = () => {
    router.push(ROUTES.HABIT.CREATE);
  };

  const handleHabitPress = (habit: { id: string }) => {
    router.push(ROUTES.HABIT.DETAIL(habit.id));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading habits...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.subtitle}>🔥 {totalStreak} total streak days</Text>
      </View>

      {todayHabits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No habits yet</Text>
          <Text style={styles.emptyHint}>Add your first habit to start tracking</Text>
        </View>
      ) : (
        todayHabits.map((habit) => <HabitCard key={habit.id} habit={habit} onPress={handleHabitPress} />)
      )}

      <AddHabitButton onPress={handleAddHabit} />

      {habits.length > 5 && (
        <Text
          style={styles.viewAll}
          onPress={() => router.push(ROUTES.TABS.HABITS)}
        >
          View all {habits.length} habits →
        </Text>
      )}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
  },
  empty: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  viewAll: {
    fontSize: 15,
    color: '#2d5a47',
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});
