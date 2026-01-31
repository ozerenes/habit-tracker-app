import React, { useState, useLayoutEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useHabitDetail, useWeeklyInsights } from '@/hooks';
import { HabitCheckIn, WeeklyInsights } from '@/components';
import { useTheme, SPACING } from '@/theme';
import { ROUTES } from '@/navigation/routes';
import { habitService } from '@/services';

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const HEADER_ICON_SIZE = 24;
const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

export function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const habitId = Array.isArray(id) ? id[0] : id;
  const theme = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    habit,
    checkIns,
    loading,
    error,
    toggleCheckIn,
    isCompleting,
  } = useHabitDetail(habitId);
  const {
    insights: weeklyInsights,
    loading: insightsLoading,
  } = useWeeklyInsights(habitId, 8);

  const [today] = React.useState(() => new Date().toISOString().slice(0, 10));
  const todayCheckIn = checkIns.find((c) => c.date === today);

  const handleBackToHome = () => {
    router.replace(ROUTES.TABS.HOME);
  };

  const handleDeleteHabit = () => {
    if (!habitId) return;
    Alert.alert(
      "Alışkanlığı Sil",
      "Bu alışkanlığı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const deleted = await habitService.deleteHabit(habitId);
              if (deleted) router.replace(ROUTES.TABS.HOME);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  useLayoutEffect(() => {
    const tint = theme.textPrimary;
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={handleBackToHome}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
        >
          <Ionicons name="home-outline" size={HEADER_ICON_SIZE} color={tint} />
        </Pressable>
      ),
      headerRight: () =>
        habit ? (
          <Pressable
            onPress={handleDeleteHabit}
            disabled={isDeleting}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={theme.error} />
            ) : (
              <Ionicons
                name="trash-outline"
                size={HEADER_ICON_SIZE}
                color={theme.error}
              />
            )}
          </Pressable>
        ) : null,
    });
  }, [navigation, theme.textPrimary, theme.error, habit, isDeleting]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.textTertiary }]}>
          Loading…
        </Text>
      </View>
    );
  }

  if (error || !habit) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error ?? 'Habit not found'}
        </Text>
      </View>
    );
  }

  const iconBg = hexToRgba(habit.color, 0.2);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
        <Text style={[styles.name, { color: theme.textPrimary }]}>
          {habit.name}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.streak, { color: theme.textTertiary }]}>
            {habit.streak} days
          </Text>
          {habit.syncStatus === 'pending' && (
            <Text style={[styles.syncPending, { color: theme.textTertiary }]}>
              · Saved locally
            </Text>
          )}
        </View>
        {habit.description ? (
          <Text
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {habit.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Today
        </Text>
        <HabitCheckIn
          date={today}
          count={todayCheckIn?.count ?? 0}
          checked={!!todayCheckIn}
          onPress={() => toggleCheckIn(today)}
          disabled={isCompleting}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Recent
        </Text>
        {checkIns.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
            No check-ins yet
          </Text>
        ) : (
          checkIns
            .filter((c) => c.date !== today)
            .slice(0, 14)
            .map((ci) => (
              <HabitCheckIn
                key={ci.id}
                date={ci.date}
                count={ci.count}
                checked={true}
                onPress={() => toggleCheckIn(ci.date)}
                disabled={isCompleting}
              />
            ))
        )}
      </View>

      <WeeklyInsights insights={weeklyInsights} loading={insightsLoading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: SPACING.xxl + 60,
  },
  headerButton: {
    padding: SPACING.xs,
    marginHorizontal: Platform.OS === 'ios' ? -4 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonPressed: {
    opacity: 0.6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 14,
    marginBottom: SPACING.lg,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: 28,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  streak: {
    fontSize: 14,
  },
  syncPending: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    marginTop: SPACING.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 14,
    paddingVertical: SPACING.md,
  },
});
