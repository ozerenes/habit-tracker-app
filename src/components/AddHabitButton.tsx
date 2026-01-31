import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/theme';
import { SPACING, RADIUS } from '@/theme';

type AddHabitButtonProps = {
  onPress: () => void;
};

export function AddHabitButton({ onPress }: AddHabitButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.primary,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
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
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  plus: {
    fontSize: 22,
    color: '#fff',
    marginRight: SPACING.sm,
    fontWeight: '300',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
