import { useState, useEffect, useCallback } from 'react';
import { habitService } from '@/services';
import type { Habit } from '@/storage';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useTodayHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsData, completions] = await Promise.all([
        habitService.getAllHabits(),
        habitService.getCompletionsForDate(today()),
      ]);
      setHabits(habitsData);
      setCompletedIds(new Set(completions.map((c) => c.habitId)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleCompletion = useCallback(
    async (habitId: string) => {
      const isCompleted = completedIds.has(habitId);
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (isCompleted) next.delete(habitId);
        else next.add(habitId);
        return next;
      });

      try {
        if (isCompleted) {
          await habitService.removeCompletion(habitId, today());
        } else {
          await habitService.addCompletion(habitId, today(), 1);
        }
        const updated = await habitService.getHabitById(habitId);
        if (updated) {
          setHabits((prev) =>
            prev.map((h) => (h.id === habitId ? updated : h))
          );
        }
      } catch {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          if (isCompleted) next.add(habitId);
          else next.delete(habitId);
          return next;
        });
      }
    },
    [completedIds]
  );

  const isCompleted = useCallback(
    (habitId: string) => completedIds.has(habitId),
    [completedIds]
  );

  return { habits, loading, error, refetch, toggleCompletion, isCompleted };
}
