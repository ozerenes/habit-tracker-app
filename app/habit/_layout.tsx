import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';

export default function HabitLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bg = isDark ? '#121110' : '#FAF9F7';
  const tint = isDark ? '#F5F4F2' : '#1C1B19';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: bg },
        headerTintColor: tint,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        contentStyle: { backgroundColor: bg },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{ title: 'Alışkanlık', headerBackTitle: 'Ana Sayfaya Dön' }}
      />
      <Stack.Screen
        name="create"
        options={{ title: 'Yeni Alışkanlık', headerBackTitle: 'Ana Sayfaya Dön' }}
      />
    </Stack>
  );
}
