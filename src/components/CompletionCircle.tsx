import React, { useRef } from 'react';
import { Pressable, StyleSheet, View, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';

type CompletionCircleProps = {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  /** Primary interaction — haptic on completion */
  isPrimaryAction?: boolean;
};

export function CompletionCircle({
  checked,
  onPress,
  disabled,
  size = 28,
  isPrimaryAction = true,
}: CompletionCircleProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (disabled) return;
    if (isPrimaryAction && !checked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.touchTarget,
        { width: Math.max(44, size + 16), height: Math.max(44, size + 16) },
      ]}
      accessibilityRole="button"
      accessibilityLabel={checked ? 'Mark incomplete' : 'Mark complete'}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: theme.textTertiary,
            transform: [{ scale: scaleAnim }],
          },
          checked && {
            borderColor: theme.primary,
            backgroundColor: theme.primaryMuted,
          },
        ]}
      >
        {checked && (
          <View style={[styles.check, { borderColor: theme.textPrimary }]} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchTarget: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 8,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    marginBottom: 3,
    marginLeft: 2,
    transform: [{ rotate: '-45deg' }],
  },
});
