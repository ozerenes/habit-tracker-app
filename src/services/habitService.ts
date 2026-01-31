import { storage } from '@/storage';
import type { Habit, HabitCheckIn } from '@/storage';
import { nanoid } from './utils';

export const habitService = {
  async getAllHabits(): Promise<Habit[]> {
    return storage.getHabits();
  },

  async getHabitById(id: string): Promise<Habit | null> {
    const habits = await storage.getHabits();
    return habits.find((h) => h.id === id) ?? null;
  },

  async createHabit(
    data: Omit<Habit, 'id' | 'streak' | 'createdAt' | 'updatedAt'>
  ): Promise<Habit> {
    const habits = await storage.getHabits();
    const now = new Date().toISOString();
    const habit: Habit = {
      ...data,
      id: nanoid(),
      streak: 0,
      createdAt: now,
      updatedAt: now,
      _syncVersion: Date.now(),
    };
    habits.push(habit);
    await storage.setHabits(habits);
    return habit;
  },

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | null> {
    const habits = await storage.getHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) return null;
    habits[index] = {
      ...habits[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      _syncVersion: Date.now(),
    };
    await storage.setHabits(habits);
    return habits[index];
  },

  async deleteHabit(id: string): Promise<boolean> {
    const habits = await storage.getHabits();
    const filtered = habits.filter((h) => h.id !== id);
    if (filtered.length === habits.length) return false;
    const checkIns = await storage.getCheckIns();
    await storage.setCheckIns(checkIns.filter((c) => c.habitId !== id));
    await storage.setHabits(filtered);
    return true;
  },

  async getCheckInsForHabit(habitId: string): Promise<HabitCheckIn[]> {
    const checkIns = await storage.getCheckIns();
    return checkIns.filter((c) => c.habitId === habitId).sort((a, b) => b.date.localeCompare(a.date));
  },

  async addCheckIn(
    habitId: string,
    date: string,
    count: number = 1,
    note?: string
  ): Promise<HabitCheckIn> {
    const checkIns = await storage.getCheckIns();
    const existing = checkIns.find((c) => c.habitId === habitId && c.date === date);
    const now = new Date().toISOString();

    if (existing) {
      existing.count += count;
      if (note) existing.note = note;
      existing._syncVersion = Date.now();
      await storage.setCheckIns(checkIns);
      return existing;
    }

    const checkIn: HabitCheckIn = {
      id: nanoid(),
      habitId,
      date,
      count,
      note,
      createdAt: now,
      _syncVersion: Date.now(),
    };
    checkIns.push(checkIn);
    await storage.setCheckIns(checkIns);

    // Update streak
    const habit = await this.getHabitById(habitId);
    if (habit) {
      const streak = await this.calculateStreak(habitId, date);
      await this.updateHabit(habitId, { streak });
    }

    return checkIn;
  },

  async calculateStreak(habitId: string, upToDate: string): Promise<number> {
    const checkIns = await this.getCheckInsForHabit(habitId);
    let streak = 0;
    const targetDate = new Date(upToDate);
    targetDate.setHours(0, 0, 0, 0);

    const dateSet = new Set(checkIns.map((c) => c.date));

    for (let i = 0; ; i++) {
      const d = new Date(targetDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      if (!dateSet.has(dateStr)) break;
      streak++;
    }
    return streak;
  },
};
