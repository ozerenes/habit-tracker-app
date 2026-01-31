# Habit Tracker

Offline-first habit tracking app built with **React Native (Expo)**. All data is stored locally; the app is structured for future backend sync.

---

## Offline-first architecture

- **Local-first storage**: Habits and daily completions are persisted with AsyncStorage via a thin abstraction (`storage/`). The UI never touches storage directly—data flows through services and hooks.
- **Domain model**: Each habit and completion has `syncStatus` (`synced` | `pending`) and `localUpdatedAt` / `syncedAt` so the app can distinguish local-only vs synced state. The UI reflects this (e.g. “Pending” on unsynced items).
- **Single source of truth**: Reads and writes go through `habitService` and `insightsService`. Aggregation (e.g. weekly completion rate) lives in services; hooks expose data and loading state to screens.

---

## Sync flow

- **Network awareness**: NetInfo powers a `useNetworkStatus` hook. `syncService.isOnline()` uses NetInfo when deciding whether to run sync.
- **Sync on reconnect**: When the app comes back online, `SyncOnReconnect` (mounted in the root layout) calls `syncService.sync()`. No global loading spinner—sync runs in the background.
- **Prepared for backend**: Mutations mark entities as `pending`. `syncService` exposes `queueForSync` and `sync()`; the latter is a stub that will later push/pull from a server. Storage keys and `_syncVersion`-style fields are in place for a real sync pipeline.

---

## Key design decisions

| Decision | Rationale |
|----------|-----------|
| **Storage behind services** | UI depends only on domain APIs (e.g. `habitService.createHabit`, `useHabits`). Storage details (keys, adapters) stay in one layer and can be swapped (e.g. SQLite, MMKV) without touching screens. |
| **Centralized routes** | All route paths live in `src/navigation/routes.ts` (`ROUTES.*`). No hardcoded URLs; navigation stays consistent and refactor-friendly. |
| **Hooks for data, screens for UI** | `useHabits`, `useHabitDetail`, `useCreateHabit`, `useWeeklyInsights` own loading/error and service calls. Screens stay presentational and testable. |
| **Per-entity sync state** | Sync status is per habit and per completion. The UI can show “Pending” only where relevant and avoid global sync spinners. |
| **Weekly insights in service layer** | Weekly completion rate is computed in `insightsService` (ISO week, target days, completion count). The hook and component only consume the result; aggregation logic stays out of the UI. |

---

## Possible future improvements

- **Backend sync**: Implement `syncService.sync()` with a real API (e.g. REST or GraphQL), map local IDs to server IDs, and update `syncedAt` / `syncStatus` after successful sync.
- **Conflict resolution**: Define rules for when the same habit or completion is edited offline and on the server (e.g. last-write-wins, or merge by `localUpdatedAt`).
- **Sync queue**: Persist pending mutations in a queue (storage already has a slot for it) and replay on connect; retry with backoff on failure.
- **Auth**: Add login/session and attach user context to sync requests so data is scoped per account.
- **Tests**: Add unit tests for `habitService`, `insightsService`, and validation; integration tests for storage and key user flows.

---

## Setup

```bash
npm install
npx expo start
```

For a development build (iOS/Android): `npx expo prebuild` then `npx expo run:ios` or `npx expo run:android`.

---

## Project structure

```
src/
├── components/   # Reusable UI (HabitCard, WeeklyInsights, …)
├── screens/      # Screen components wired by app routes
├── storage/      # AsyncStorage adapter, domain types, migration
├── services/     # habitService, insightsService, syncService, validation
├── hooks/        # useHabits, useHabitDetail, useCreateHabit, useWeeklyInsights, useNetworkStatus
└── navigation/   # Centralized ROUTES

app/              # Expo Router (file-based)
├── (tabs)/       # Today, Habits, Profile
└── habit/        # Detail [id], Create
```
