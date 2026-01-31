import { useState, useEffect, useCallback } from 'react';
import { habitService } from '@/services';
import type { Habit, HabitCompletion } from '@/storage';

export function useHabitDetail(habitId: string | undefined) {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [checkIns, setCheckIns] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!habitId) {
      setHabit(null);
      setCheckIns([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [habitData, checkInsData] = await Promise.all([
        habitService.getHabitById(habitId),
        habitService.getCompletionsForHabit(habitId),
      ]);
      setHabit(habitData);
      setCheckIns(checkInsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load habit');
    } finally {
      setLoading(false);
    }
  }, [habitId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const checkIn = useCallback(
    async (date: string, count: number = 1, note?: string) => {
      if (!habitId) return null;
      const ci = await habitService.addCompletion(habitId, date, count, note);
      setCheckIns((prev) => {
        const idx = prev.findIndex((c) => c.habitId === habitId && c.date === date);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = ci;
          return next;
        }
        return [ci, ...prev];
      });
      const updated = await habitService.getHabitById(habitId);
      if (updated) setHabit(updated);
      return ci;
    },
    [habitId]
  );

  return { habit, checkIns, loading, error, refetch, checkIn };
}
