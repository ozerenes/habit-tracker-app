/**
 * Local storage - clean abstraction over AsyncStorage for Habit domain.
 * All persistence goes through this layer.
 */

import { createJsonStorage } from './adapter';
import { asyncStorageAdapter } from './asyncStorageAdapter';
import { migrateCompletion, migrateHabit } from './migration';
import type { Habit, HabitCompletion, SyncMetadata } from './storage.types';
import { STORAGE_KEYS } from './storage.types';

const habitsStorage = createJsonStorage<unknown[]>(asyncStorageAdapter, STORAGE_KEYS.HABITS);
const completionsStorage = createJsonStorage<unknown[]>(
  asyncStorageAdapter,
  STORAGE_KEYS.COMPLETIONS
);
const legacyCheckInsStorage = createJsonStorage<unknown[]>(
  asyncStorageAdapter,
  STORAGE_KEYS.CHECK_INS
);
const syncMetadataStorage = createJsonStorage<SyncMetadata>(
  asyncStorageAdapter,
  STORAGE_KEYS.SYNC_METADATA
);

async function getDefault<T>(storage: { get(): Promise<T | null> }, fallback: T): Promise<T> {
  const value = await storage.get();
  return value ?? fallback;
}

export const storage = {
  habits: {
    async getAll(): Promise<Habit[]> {
      const raw = await getDefault(habitsStorage, []);
      return (Array.isArray(raw) ? raw : []).map(migrateHabit);
    },
    async setAll(habits: Habit[]): Promise<void> {
      await habitsStorage.set(habits);
    },
    async getById(id: string): Promise<Habit | null> {
      const all = await this.getAll();
      return all.find((h) => h.id === id && !h.deletedAt) ?? null;
    },
    async save(habit: Habit): Promise<void> {
      const all = await this.getAll();
      const idx = all.findIndex((h) => h.id === habit.id);
      if (idx >= 0) all[idx] = habit;
      else all.push(habit);
      await habitsStorage.set(all);
    },
    async remove(id: string): Promise<void> {
      const all = await this.getAll().then((list) => list.filter((h) => h.id !== id));
      await habitsStorage.set(all);
    },
  },

  completions: {
    async getAll(): Promise<HabitCompletion[]> {
      let raw = await completionsStorage.get();
      if ((!raw || (Array.isArray(raw) && raw.length === 0)) && legacyCheckInsStorage) {
        const legacy = await legacyCheckInsStorage.get();
        if (Array.isArray(legacy) && legacy.length > 0) {
          raw = legacy;
          await completionsStorage.set(raw);
          await legacyCheckInsStorage.remove();
        }
      }
      const arr = Array.isArray(raw) ? raw : [];
      return arr.map(migrateCompletion);
    },
    async setAll(completions: HabitCompletion[]): Promise<void> {
      await completionsStorage.set(completions);
    },
    async getByHabitId(habitId: string): Promise<HabitCompletion[]> {
      const all = await this.getAll();
      return all
        .filter((c) => c.habitId === habitId && !c.deletedAt)
        .sort((a, b) => b.date.localeCompare(a.date));
    },
    async getByDate(habitId: string, date: string): Promise<HabitCompletion | null> {
      const all = await this.getAll();
      return all.find((c) => c.habitId === habitId && c.date === date && !c.deletedAt) ?? null;
    },
    async save(completion: HabitCompletion): Promise<void> {
      const all = await this.getAll();
      const idx = all.findIndex((c) => c.id === completion.id);
      if (idx >= 0) all[idx] = completion;
      else all.push(completion);
      await completionsStorage.set(all);
    },
    async removeByHabitId(habitId: string): Promise<void> {
      const all = await this.getAll().then((list) => list.filter((c) => c.habitId !== habitId));
      await completionsStorage.set(all);
    },
  },

  sync: {
    async getMetadata(): Promise<SyncMetadata> {
      return getDefault(syncMetadataStorage, { pendingCount: 0 });
    },
    async setMetadata(metadata: SyncMetadata): Promise<void> {
      await syncMetadataStorage.set(metadata);
    },
  },

  /** @deprecated Use storage.habits.getAll */
  async getHabits(): Promise<Habit[]> {
    return this.habits.getAll();
  },

  /** @deprecated Use storage.habits.setAll */
  async setHabits(habits: Habit[]): Promise<void> {
    await this.habits.setAll(habits);
  },

  /** @deprecated Use storage.completions.getAll */
  async getCheckIns(): Promise<HabitCompletion[]> {
    return this.completions.getAll();
  },

  /** @deprecated Use storage.completions.setAll */
  async setCheckIns(completions: HabitCompletion[]): Promise<void> {
    await this.completions.setAll(completions);
  },

  /** @deprecated Use storage.sync */
  async getSyncQueue(): Promise<unknown[]> {
    return [];
  },
  async setSyncQueue(): Promise<void> {},
};
