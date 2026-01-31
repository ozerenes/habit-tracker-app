# Habit Tracker

Offline-first habit tracking app built with React Native (Expo).

## Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components (used by app routes)
├── storage/        # AsyncStorage abstraction, types
├── services/       # habitService, syncService (sync-ready)
├── hooks/          # useHabits, useHabitDetail
└── navigation/     # Centralized ROUTES (no hardcoded paths)

app/                # Expo Router file-based routes
├── (tabs)/         # Tab navigator: Today, Habits, Profile
└── habit/          # Stack: [id], create
```

## Setup

```bash
npm install
npx expo start
```

## Offline Sync (Future)

- `storage.setSyncQueue` / `storage.getSyncQueue` for pending changes
- `syncService` stubs: `queueForSync`, `sync`, `isOnline`
- Add `@react-native-community/netinfo` and backend when ready

## Navigation

All routes live in `src/navigation/routes.ts`. Use `ROUTES.*` for navigation:

```ts
import { ROUTES } from '@/navigation/routes';
router.push(ROUTES.HABIT.DETAIL(habit.id));
router.push(ROUTES.HABIT.CREATE);
```
