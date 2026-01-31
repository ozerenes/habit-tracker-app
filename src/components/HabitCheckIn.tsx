import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { SPACING, RADIUS } from '@/theme';
import { CompletionCircle } from './CompletionCircle';

type HabitCheckInProps = {
  date: string;
  count: number;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  syncStatus?: 'synced' | 'pending';
};

export function HabitCheckIn({
  date,
  count,
  checked,
  onPress,
  disabled,
}: HabitCheckInProps) {
  const theme = useTheme();
  const displayDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
        },
        checked && {
          backgroundColor: theme.surfaceElevated,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [styles.main, pressed && { opacity: 0.98 }]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[styles.date, { color: theme.textPrimary }]}>
          {displayDate}
        </Text>
        {count > 1 && (
          <Text style={[styles.count, { color: theme.textTertiary }]}>
            {count}×
          </Text>
        )}
      </Pressable>
      <CompletionCircle
        checked={checked}
        onPress={onPress}
        disabled={disabled}
        isPrimaryAction={false}
        size={26}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  count: {
    fontSize: 13,
  },
});
