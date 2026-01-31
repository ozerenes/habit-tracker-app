import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Habit } from '@/storage';

type HabitCardProps = {
  habit: Habit;
  onPress?: (habit: Habit) => void;
};

export function HabitCard({ habit, onPress }: HabitCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(habit)} android_ripple={{ color: 'rgba(255,255,255,0.1)' }}>
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
