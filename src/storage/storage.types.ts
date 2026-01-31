/**
 * Habit domain model - offline-first, sync-ready
 */

export type SyncStatus = 'synced' | 'pending';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

/**
 * Habit - core domain entity
 * Supports local persistence and future backend sync
 */
export type Habit = {
  id: string;
  /** Server-assigned ID after sync (future) */
  serverId?: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  /** 0-6 (Sun-Sat) - days when habit applies */
  targetDays: number[];
  targetCount?: number;
  streak: number;
  /** Last modified locally */
  localUpdatedAt: string;
  /** Last synced to server (future) */
  syncedAt?: string;
  createdAt: string;
  /** Soft delete for sync - pending records marked deleted */
  deletedAt?: string;
  syncStatus: SyncStatus;
};

/**
 * Daily completion - tracks habit completion per day
 */
export type HabitCompletion = {
  id: string;
  habitId: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  count: number;
  note?: string;
  /** Server-assigned ID after sync (future) */
  serverId?: string;
  localUpdatedAt: string;
  syncedAt?: string;
  createdAt: string;
  deletedAt?: string;
  syncStatus: SyncStatus;
};

/**
 * Sync metadata - tracks last sync state for future backend integration
 */
export type SyncMetadata = {
  lastSyncAt?: string;
  syncCursor?: string;
  pendingCount: number;
};

/** @deprecated Use HabitCompletion */
export type HabitCheckIn = HabitCompletion;

export const STORAGE_KEYS = {
  HABITS: '@habit_tracker/habits',
  COMPLETIONS: '@habit_tracker/completions',
  /** @deprecated Legacy key - migration reads from this */
  CHECK_INS: '@habit_tracker/check_ins',
  SYNC_METADATA: '@habit_tracker/sync_metadata',
  SYNC_QUEUE: '@habit_tracker/sync_queue',
  USER_PREFS: '@habit_tracker/user_prefs',
} as const;
