import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useNetworkStatus } from '@/hooks';

type SyncIndicatorProps = {
  /** Show when there are pending changes. Pass from sync metadata or storage. */
  hasPendingChanges?: boolean;
};

/**
 * Subtle sync/offline indicator. Per design: never alarming, rarely noticed.
 * Renders a slim bar when offline or when changes are pending.
 */
export function SyncIndicator({ hasPendingChanges = false }: SyncIndicatorProps) {
  const theme = useTheme();
  const { isOnline } = useNetworkStatus();

  if (isOnline && !hasPendingChanges) {
    return null;
  }

  const message = !isOnline
    ? 'Offline — changes saved on device'
    : 'Saved locally';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.divider,
        },
      ]}
    >
      {!isOnline ? (
        <Ionicons
          name="cloud-offline-outline"
          size={14}
          color={theme.textTertiary}
          style={styles.icon}
        />
      ) : (
        <View
          style={[styles.dot, { backgroundColor: theme.textTertiary }]}
        />
      )}
      <Text style={[styles.text, { color: theme.textTertiary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 11,
  },
});
