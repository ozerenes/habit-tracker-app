import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { SyncIndicator } from '@/components';

function TabIcon({
  name,
  focused,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}) {
  return <Ionicons name={name} size={22} color={color} />;
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SyncIndicator />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.divider,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textTertiary,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
            color: theme.textPrimary,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                name={focused ? 'calendar' : 'calendar-outline'}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                name={focused ? 'checkbox' : 'checkbox-outline'}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                name={focused ? 'person' : 'person-outline'}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
