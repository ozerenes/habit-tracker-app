import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useHabits } from '@/hooks';
import { HabitCard, AddHabitButton } from '@/components';
import { ROUTES } from '@/navigation/routes';
import { useTheme } from '@/theme';
import { SPACING } from '@/theme';

export function HabitsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { habits, loading, error, refetch } = useHabits();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleAddHabit = () => {
    router.push(ROUTES.HABIT.CREATE);
  };

  const handleHabitPress = (habit: { id: string }) => {
    router.push(ROUTES.HABIT.DETAIL(habit.id));
  };

  const isInitialLoad = loading && habits.length === 0;
  if (isInitialLoad) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.placeholderText, { color: theme.textTertiary }]}>
          Loading habits...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        <Text
          style={[styles.retryHint, { color: theme.primary }]}
          onPress={refetch}
        >
          Tap to retry
        </Text>
      </View>
    );
  }

  const isEmpty = habits.length === 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        isEmpty && styles.contentEmpty,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refetch}
          tintColor={theme.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          My Habits
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {habits.length} habits
        </Text>
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>
            No habits yet
          </Text>
          <Text style={[styles.emptyHint, { color: theme.textTertiary }]}>
            Add your first habit
          </Text>
          <View style={styles.emptyAction}>
            <AddHabitButton onPress={handleAddHabit} />
          </View>
        </View>
      ) : (
        <>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={handleHabitPress}
              showCompletionCircle={false}
            />
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
  },
  content: {
    padding: 20,
    paddingBottom: SPACING.xl + 60,
  },
  contentEmpty: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  placeholderText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryHint: {
    fontSize: 14,
    marginTop: SPACING.sm,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: SPACING.xs,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: SPACING.sm,
  },
  emptyAction: {
    marginTop: SPACING.lg,
    width: '100%',
  },
});
