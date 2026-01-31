/**
 * Hook for habit creation - encapsulates write flow, no storage details in UI.
 * Uses habitService for persistence; UI only sees domain-level input/output.
 */

import { useState, useCallback } from 'react';
import { habitService } from '@/services';
import { validateCreateHabit, type CreateHabitFormData } from '@/services/habitValidation';

export type CreateHabitResult = { id: string } | null;

export type ValidationErrors = Partial<Record<keyof CreateHabitFormData, string>>;

export function useCreateHabit() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const createHabit = useCallback(async (data: CreateHabitFormData): Promise<CreateHabitResult> => {
    const { valid, errors } = validateCreateHabit(data);
    setValidationErrors(errors);

    if (!valid) {
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const habit = await habitService.createHabit({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        color: data.color,
        icon: data.icon,
        frequency: 'daily',
        targetDays: [0, 1, 2, 3, 4, 5, 6],
      });
      return { id: habit.id };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create habit');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setValidationErrors({});
  }, []);

  return { createHabit, isSaving, error, validationErrors, clearError };
}
