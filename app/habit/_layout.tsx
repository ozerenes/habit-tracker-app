import { Stack } from 'expo-router';

export default function HabitLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        contentStyle: { backgroundColor: '#0a0a0a' },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{ title: 'Habit', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="create"
        options={{ title: 'New Habit', headerBackTitle: 'Cancel' }}
      />
    </Stack>
  );
}
