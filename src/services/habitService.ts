import { storage } from '@/storage';
import type { Habit, HabitCompletion } from '@/storage';
import { nanoid } from './utils';

function now(): string {
  return new Date().toISOString();
}

export const habitService = {
  async getAllHabits(): Promise<Habit[]> {
    return storage.habits.getAll();
  },

  async getHabitById(id: string): Promise<Habit | null> {
    return storage.habits.getById(id);
  },

  async createHabit(
    data: Omit<Habit, 'id' | 'streak' | 'createdAt' | 'localUpdatedAt' | 'syncStatus'>
  ): Promise<Habit> {
    const ts = now();
    const habit: Habit = {
      ...data,
      id: nanoid(),
      streak: 0,
      createdAt: ts,
      localUpdatedAt: ts,
      syncStatus: 'pending',
    };
    await storage.habits.save(habit);
    return habit;
  },

  async updateHabit(id: string, updates: Partial<Pick<Habit, 'streak' | 'name' | 'color' | 'icon'>>): Promise<Habit | null> {
    const habit = await storage.habits.getById(id);
    if (!habit) return null;
    const updated: Habit = {
      ...habit,
      ...updates,
      localUpdatedAt: now(),
      syncStatus: 'pending',
    };
    await storage.habits.save(updated);
    return updated;
  },

  async deleteHabit(id: string): Promise<boolean> {
    const habit = await storage.habits.getById(id);
    if (!habit) return false;
    await storage.habits.remove(id);
    await storage.completions.removeByHabitId(id);
    return true;
  },

  async getCompletionsForHabit(habitId: string): Promise<HabitCompletion[]> {
    return storage.completions.getByHabitId(habitId);
  },

  async addCompletion(
    habitId: string,
    date: string,
    count: number = 1,
    note?: string
  ): Promise<HabitCompletion> {
    const existing = await storage.completions.getByDate(habitId, date);
    const ts = now();

    if (existing) {
      const updated: HabitCompletion = {
        ...existing,
        count: existing.count + count,
        note: note ?? existing.note,
        localUpdatedAt: ts,
        syncStatus: 'pending',
      };
      await storage.completions.save(updated);

      const streak = await this.calculateStreak(habitId, date);
      await this.updateHabit(habitId, { streak });

      return updated;
    }

    const completion: HabitCompletion = {
      id: nanoid(),
      habitId,
      date,
      count,
      note,
      createdAt: ts,
      localUpdatedAt: ts,
      syncStatus: 'pending',
    };
    await storage.completions.save(completion);

    const streak = await this.calculateStreak(habitId, date);
    await this.updateHabit(habitId, { streak });

    return completion;
  },

  async calculateStreak(habitId: string, upToDate: string): Promise<number> {
    const completions = await this.getCompletionsForHabit(habitId);
    const dateSet = new Set(completions.map((c) => c.date));
    let streak = 0;
    const targetDate = new Date(upToDate + 'T12:00:00Z');

    for (let i = 0; ; i++) {
      const d = new Date(targetDate);
      d.setUTCDate(d.getUTCDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      if (!dateSet.has(dateStr)) break;
      streak++;
    }
    return streak;
  },
};
