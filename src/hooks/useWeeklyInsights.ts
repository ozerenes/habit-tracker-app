/**
 * Hook for weekly habit insights - fetches aggregated data, no UI.
 */

import { useState, useEffect, useCallback } from 'react';
import { insightsService, type WeeklyInsight } from '@/services';

export function useWeeklyInsights(habitId: string | undefined, numWeeks: number = 8) {
  const [insights, setInsights] = useState<WeeklyInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!habitId) {
      setInsights([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await insightsService.getWeeklyInsights(habitId, numWeeks);
      setInsights(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  }, [habitId, numWeeks]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { insights, loading, error, refetch };
}
