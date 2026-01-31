/**
 * Centralized route definitions - no hardcoded strings across the app.
 * Add new routes here and reference via ROUTES.*
 */

export const ROUTES = {
  ROOT: '/',
  TABS: {
    HOME: '/(tabs)',
    HABITS: '/(tabs)/habits',
    PROFILE: '/(tabs)/profile',
  },
  HABIT: {
    DETAIL: (id: string) => `/habit/${id}` as const,
    CREATE: '/habit/create',
    EDIT: (id: string) => `/habit/${id}/edit` as const,
  },
} as const;

export type RouteParams = {
  'habit/[id]': { id: string };
};
