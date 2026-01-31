/**
 * Weekly habit insights - aggregation only, no UI.
 * Uses habit + completions to compute per-week completion rate.
 */

import { habitService } from './habitService';
import type { Habit } from '@/storage';

export type WeeklyInsight = {
  weekKey: string;
  weekLabel: string;
  daysCompleted: number;
  targetDays: number;
  completionRate: number;
};

/** ISO week: Monday = start. Returns YYYY-MM-DD of Monday. */
function getWeekStart(date: Date): string {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay();
  const daysSinceMonday = (day + 6) % 7;
  d.setDate(d.getDate() - daysSinceMonday);
  return d.toISOString().slice(0, 10);
}

/** Week key for grouping (Monday date YYYY-MM-DD). */
function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00Z');
  return getWeekStart(date);
}

/** All dates (YYYY-MM-DD) in the week starting Monday. */
function getDatesInWeek(weekStart: string): string[] {
  const dates: string[] = [];
  const start = new Date(weekStart + 'T12:00:00Z');
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

/** Dates in the week that are target days (0=Sun .. 6=Sat). */
function getTargetDatesInWeek(habit: Habit, weekStart: string): string[] {
  const dates = getDatesInWeek(weekStart);
  return dates.filter((dateStr) => {
    const d = new Date(dateStr + 'T12:00:00Z');
    return habit.targetDays.includes(d.getUTCDay());
  });
}

/** Short label for the week, e.g. "Jan 27 – Feb 2". */
function getWeekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T12:00:00Z');
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export const insightsService = {
  /**
   * Aggregate completion data per week and compute completion rate.
   * completionRate = daysCompleted / targetDays (capped at 1).
   */
  async getWeeklyInsights(
    habitId: string,
    numWeeks: number = 8
  ): Promise<WeeklyInsight[]> {
    const [habit, completions] = await Promise.all([
      habitService.getHabitById(habitId),
      habitService.getCompletionsForHabit(habitId),
    ]);

    if (!habit) return [];

    const today = new Date().toISOString().slice(0, 10);
    const thisWeekStart = getWeekKey(today);

    const weekKeys = new Set<string>();
    for (const c of completions) {
      weekKeys.add(getWeekKey(c.date));
    }

    const weeksToShow: string[] = [];
    let cursor = new Date(thisWeekStart + 'T12:00:00Z');
    for (let i = 0; i < numWeeks; i++) {
      const key = getWeekStart(cursor);
      weeksToShow.push(key);
      cursor.setUTCDate(cursor.getUTCDate() - 7);
    }

    const dateToCount = new Map<string, number>();
    for (const c of completions) {
      const existing = dateToCount.get(c.date) ?? 0;
      dateToCount.set(c.date, existing + c.count);
    }

    const insights: WeeklyInsight[] = weeksToShow.map((weekStart) => {
      const targetDates = getTargetDatesInWeek(habit, weekStart);
      const daysCompleted = targetDates.filter(
        (d) => (dateToCount.get(d) ?? 0) >= 1
      ).length;
      const targetDays = targetDates.length;
      const completionRate =
        targetDays > 0 ? Math.min(1, daysCompleted / targetDays) : 0;

      return {
        weekKey: weekStart,
        weekLabel: getWeekLabel(weekStart),
        daysCompleted,
        targetDays,
        completionRate,
      };
    });

    return insights;
  },
};
