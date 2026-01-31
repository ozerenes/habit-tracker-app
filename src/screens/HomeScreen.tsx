import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTodayHabits } from '@/hooks';
import { HabitCard, AddHabitButton } from '@/components';
import { ROUTES } from '@/navigation/routes';
import { useTheme } from '@/theme';
import { SPACING } from '@/theme';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { habits, loading, error, refetch, toggleCompletion, isCompleted } = useTodayHabits();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const todayHabits = habits.slice(0, 5);
  const hasMore = habits.length > 5;

  const handleAddHabit = () => {
    router.push(ROUTES.HABIT.CREATE);
  };

  const handleHabitPress = (habit: { id: string }) => {
    router.push(ROUTES.HABIT.DETAIL(habit.id));
  };

  if (loading && habits.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.textTertiary }]}>
          Loading habits...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.textTertiary }]}>Today</Text>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {formatDate(new Date())}
        </Text>
      </View>

      {todayHabits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No habits yet
          </Text>
          <Text style={[styles.emptyHint, { color: theme.textTertiary }]}>
            Add your first habit
          </Text>
          <AddHabitButton onPress={handleAddHabit} />
        </View>
      ) : (
        <>
          {todayHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={handleHabitPress}
              onCompletePress={(habit) => toggleCompletion(habit.id)}
              completed={isCompleted(habit.id)}
              showCompletionCircle
            />
          ))}
          <AddHabitButton onPress={handleAddHabit} />

          {hasMore && (
            <Text
              style={[styles.viewAll, { color: theme.primary }]}
              onPress={() => router.push(ROUTES.TABS.HABITS)}
            >
              View all {habits.length} habits
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: SPACING.xl + 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    marginTop: SPACING.xs,
  },
  empty: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
});
