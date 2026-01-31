export type Habit = {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  targetDays: number[]; // 0-6 (Sun-Sat)
  targetCount?: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
  /** For future sync - last sync timestamp */
  _syncVersion?: number;
};

export type HabitCheckIn = {
  id: string;
  habitId: string;
  date: string; // ISO date YYYY-MM-DD
  count: number;
  note?: string;
  createdAt: string;
  /** For future sync */
  _syncVersion?: number;
};

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export const STORAGE_KEYS = {
  HABITS: '@habit_tracker/habits',
  CHECK_INS: '@habit_tracker/check_ins',
  USER_PREFS: '@habit_tracker/user_prefs',
  SYNC_QUEUE: '@habit_tracker/sync_queue', // For future offline sync
} as const;
