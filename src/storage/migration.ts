/**
 * Migration - normalizes legacy stored data to current domain model
 */

import type { Habit, HabitCompletion } from './storage.types';

type LegacyHabit = Habit & {
  updatedAt?: string;
  _syncVersion?: number;
};

type LegacyCompletion = HabitCompletion & {
  _syncVersion?: number;
};

export function migrateHabit(raw: unknown): Habit {
  const h = raw as Partial<LegacyHabit>;
  const now = new Date().toISOString();
  return {
    id: h.id ?? '',
    serverId: h.serverId,
    name: h.name ?? '',
    description: h.description,
    color: h.color ?? '#2d5a47',
    icon: h.icon ?? '✅',
    frequency: h.frequency ?? 'daily',
    targetDays: h.targetDays ?? [0, 1, 2, 3, 4, 5, 6],
    targetCount: h.targetCount,
    streak: h.streak ?? 0,
    localUpdatedAt: h.localUpdatedAt ?? h.updatedAt ?? h.createdAt ?? now,
    syncedAt: h.syncedAt,
    createdAt: h.createdAt ?? now,
    deletedAt: h.deletedAt,
    syncStatus: h.syncStatus ?? 'pending',
  };
}

export function migrateCompletion(raw: unknown): HabitCompletion {
  const c = raw as Partial<LegacyCompletion>;
  const now = new Date().toISOString();
  return {
    id: c.id ?? '',
    habitId: c.habitId ?? '',
    date: c.date ?? '',
    count: c.count ?? 0,
    note: c.note,
    serverId: c.serverId,
    localUpdatedAt: c.localUpdatedAt ?? c.createdAt ?? now,
    syncedAt: c.syncedAt,
    createdAt: c.createdAt ?? now,
    deletedAt: c.deletedAt,
    syncStatus: c.syncStatus ?? 'pending',
  };
}
