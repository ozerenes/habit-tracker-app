import React from 'react';
import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '@/hooks';
import { HabitCard, AddHabitButton } from '@/components';
import { ROUTES } from '@/navigation/routes';

export function HabitsScreen() {
  const router = useRouter();
  const { habits, loading, error, refetch } = useHabits();

  const handleAddHabit = () => {
    router.push(ROUTES.HABIT.CREATE);
  };

  const handleHabitPress = (habit: { id: string }) => {
    router.push(ROUTES.HABIT.DETAIL(habit.id));
  };

  const isInitialLoad = loading && habits.length === 0;
  if (isInitialLoad) {
    return (
      <View style={styles.center}>
        <Text style={styles.placeholderText}>Loading habits...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryHint} onPress={refetch}>
          Tap to retry
        </Text>
      </View>
    );
  }

  const isEmpty = habits.length === 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isEmpty && styles.contentEmpty]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} tintColor="#2d5a47" />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <Text style={styles.subtitle}>{habits.length} habits</Text>
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptyHint}>Add your first habit to start tracking</Text>
          <View style={styles.emptyAction}>
            <AddHabitButton onPress={handleAddHabit} />
          </View>
        </View>
      ) : (
        <>
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onPress={handleHabitPress} />
          ))}
          <AddHabitButton onPress={handleAddHabit} />
        </>
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
  contentEmpty: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 24,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  errorText: {
    color: '#e55',
    fontSize: 16,
    textAlign: 'center',
  },
  retryHint: {
    color: '#2d5a47',
    fontSize: 14,
    marginTop: 12,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
  },
  emptyHint: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  emptyAction: {
    marginTop: 24,
    width: '100%',
  },
});
