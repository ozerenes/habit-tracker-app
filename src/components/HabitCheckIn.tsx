import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type HabitCheckInProps = {
  date: string;
  count: number;
  checked: boolean;
  onPress: () => void;
};

export function HabitCheckIn({ date, count, checked, onPress }: HabitCheckInProps) {
  const displayDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable
      style={[styles.container, checked && styles.checked]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
    >
      <Text style={styles.date}>{displayDate}</Text>
      <Text style={styles.count}>{count}×</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  checked: {
    backgroundColor: '#1e3a2f',
    borderWidth: 1,
    borderColor: '#2d5a47',
  },
  date: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  count: {
    fontSize: 14,
    color: '#888',
  },
});
