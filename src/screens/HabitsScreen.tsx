import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '@/hooks';
import { HabitCard, AddHabitButton } from '@/components';
import { ROUTES } from '@/navigation/routes';

export function HabitsScreen() {
  const router = useRouter();
  const { habits, loading, error } = useHabits();

  const handleAddHabit = () => {
    router.push(ROUTES.HABIT.CREATE);
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
        <Text style={styles.title}>My Habits</Text>
        <Text style={styles.subtitle}>{habits.length} habits</Text>
      </View>

      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}

      <AddHabitButton onPress={handleAddHabit} />
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
});
