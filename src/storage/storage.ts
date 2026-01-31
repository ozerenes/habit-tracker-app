import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Habit, HabitCheckIn } from './storage.types';
import { STORAGE_KEYS } from './storage.types';

export const storage = {
  async getHabits(): Promise<Habit[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  },

  async setHabits(habits: Habit[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },

  async getCheckIns(): Promise<HabitCheckIn[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECK_INS);
    return data ? JSON.parse(data) : [];
  },

  async setCheckIns(checkIns: HabitCheckIn[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
  },

  async getSyncQueue(): Promise<unknown[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return data ? JSON.parse(data) : [];
  },

  async setSyncQueue(queue: unknown[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  },
};
