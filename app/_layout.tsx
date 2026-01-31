import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SyncOnReconnect } from '@/components';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <SyncOnReconnect />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121110' : '#FAF9F7',
          },
          headerTintColor: colorScheme === 'dark' ? '#F5F4F2' : '#1C1B19',
          headerTitleStyle: { fontWeight: '600', fontSize: 17 },
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121110' : '#FAF9F7',
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="habit" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
