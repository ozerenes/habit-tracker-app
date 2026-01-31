import { useState, useEffect, useCallback } from 'react';
import { habitService } from '@/services';
import type { Habit } from '@/storage';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await habitService.getAllHabits();
      setHabits(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addHabit = useCallback(
    async (data: Omit<Habit, 'id' | 'streak' | 'createdAt' | 'updatedAt'>) => {
      const habit = await habitService.createHabit(data);
      setHabits((prev) => [...prev, habit]);
      return habit;
    },
    []
  );

  const removeHabit = useCallback(async (id: string) => {
    const ok = await habitService.deleteHabit(id);
    if (ok) setHabits((prev) => prev.filter((h) => h.id !== id));
    return ok;
  }, []);

  return { habits, loading, error, refetch, addHabit, removeHabit };
}
