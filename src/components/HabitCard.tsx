import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Habit } from '@/storage';
import { ROUTES } from '@/navigation/routes';

type HabitCardProps = {
  habit: Habit;
};

export function HabitCard({ habit }: HabitCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(ROUTES.HABIT.DETAIL(habit.id));
  };

  return (
    <Pressable style={styles.card} onPress={handlePress} android_ripple={{ color: 'rgba(255,255,255,0.1)' }}>
      <View style={[styles.icon, { backgroundColor: habit.color }]}>
        <Text style={styles.iconText}>{habit.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.streak}>🔥 {habit.streak} day streak</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  streak: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
});
