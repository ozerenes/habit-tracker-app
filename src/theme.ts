/**
 * Design system — colors, spacing, typography.
 * Supports light and dark mode.
 */

import { useColorScheme } from 'react-native';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 14,
  full: 9999,
} as const;

export const COLORS_LIGHT = {
  background: '#FAF9F7',
  surface: '#F5F3F0',
  surfaceElevated: '#EFEDE9',
  textPrimary: '#1C1B19',
  textSecondary: '#6B6560',
  textTertiary: '#9B9590',
  divider: '#E8E6E2',
  primary: '#3D6B5A',
  primaryMuted: 'rgba(61, 107, 90, 0.4)',
  primarySoft: 'rgba(61, 107, 90, 0.15)',
  error: '#B85450',
  errorMuted: 'rgba(184, 84, 80, 0.8)',
} as const;

export const COLORS_DARK = {
  background: '#121110',
  surface: '#1A1816',
  surfaceElevated: '#252220',
  textPrimary: '#F5F4F2',
  textSecondary: '#9C9691',
  textTertiary: '#6B6560',
  divider: '#2D2B28',
  primary: '#3D6B5A',
  primaryMuted: 'rgba(61, 107, 90, 0.5)',
  primarySoft: 'rgba(61, 107, 90, 0.2)',
  error: '#D96B66',
  errorMuted: 'rgba(217, 107, 102, 0.8)',
} as const;

export type Theme = typeof COLORS_LIGHT | typeof COLORS_DARK;

export function getTheme(dark: boolean): Theme {
  return (dark ? COLORS_DARK : COLORS_LIGHT) as Theme;
}

export function useTheme() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';
  return getTheme(dark);
}

/** Add habit color palette — muted, harmonious */
export const HABIT_COLORS = [
  '#3D6B5A', // sage
  '#5A6B7A', // dust blue
  '#6B6560', // warm gray
  '#8B6B5A', // soft terracotta
  '#6B5A7A', // muted plum
];

export const HABIT_ICONS = ['💪', '📚', '🧘', '🏃', '💧', '🌙', '✍️', '🎯', '🍎', '☀️'];
