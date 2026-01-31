/**
 * Habit creation validation - domain-level, no storage details
 */

export type CreateHabitFormData = {
  name: string;
  description?: string;
  color: string;
  icon: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: Partial<Record<keyof CreateHabitFormData, string>>;
};

export function validateCreateHabit(data: CreateHabitFormData): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  const trimmedName = data.name?.trim() ?? '';
  if (!trimmedName) {
    errors.name = 'Name is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
