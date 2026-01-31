import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Habit } from '@/storage';
import { useTheme } from '@/theme';
import { SPACING, RADIUS } from '@/theme';
import { CompletionCircle } from './CompletionCircle';

type HabitCardProps = {
  habit: Habit;
  onPress?: (habit: Habit) => void;
  /** When provided, shows completion circle and handles tap-to-complete. Stops propagation to onPress. */
  onCompletePress?: (habit: Habit) => void;
  completed?: boolean;
  /** Show completion circle (Home) vs navigate-only (Habits list) */
  showCompletionCircle?: boolean;
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function HabitCard({
  habit,
  onPress,
  onCompletePress,
  completed = false,
  showCompletionCircle = false,
}: HabitCardProps) {
  const theme = useTheme();
  const iconBg = hexToRgba(habit.color, 0.18);

  const handleCardPress = () => onPress?.(habit);

  const handleCirclePress = () => {
    onCompletePress?.(habit);
  };

  const mainContent = (
    <>
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{habit.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={1}>
          {habit.name}
        </Text>
      </View>
    </>
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Pressable
        style={({ pressed }) => [
          styles.mainArea,
          pressed && { opacity: 0.98 },
        ]}
        onPress={handleCardPress}
      >
        {mainContent}
      </Pressable>
      {showCompletionCircle && (
        <CompletionCircle
          checked={completed}
          onPress={handleCirclePress}
          isPrimaryAction
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    minHeight: 68,
    marginBottom: SPACING.sm,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 17,
    fontWeight: '500',
  },
  circleWrap: {
    marginLeft: SPACING.sm,
  },
});
