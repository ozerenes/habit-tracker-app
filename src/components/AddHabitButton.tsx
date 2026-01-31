import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type AddHabitButtonProps = {
  onPress: () => void;
};

export function AddHabitButton({ onPress }: AddHabitButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
    >
      <Text style={styles.plus}>+</Text>
      <Text style={styles.label}>Add Habit</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d5a47',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.9,
  },
  plus: {
    fontSize: 24,
    color: '#fff',
    marginRight: 8,
    fontWeight: '300',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
