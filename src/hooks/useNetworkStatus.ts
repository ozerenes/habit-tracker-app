/**
 * Network status via NetInfo - no UI, only state and subscription.
 * App can react to connectivity changes and trigger sync when online.
 */

import { useState, useEffect } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export type NetworkStatus = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string;
  /** true when connected (for UI) */
  isOnline: boolean;
  /** true when connected and internet reachable (for triggering sync) */
  isReachable: boolean;
};

function stateToStatus(state: NetInfoState): NetworkStatus {
  const isConnected = state.isConnected ?? null;
  const isInternetReachable = state.isInternetReachable ?? null;
  return {
    isConnected,
    isInternetReachable,
    type: state.type,
    isOnline: isConnected === true,
    isReachable: isConnected === true && isInternetReachable !== false,
  };
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => ({
    isConnected: null,
    isInternetReachable: null,
    type: 'unknown',
    isOnline: false,
    isReachable: false,
  }));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus(stateToStatus(state));
    });

    NetInfo.fetch().then((state: NetInfoState) => {
      setStatus(stateToStatus(state));
    });

    return unsubscribe;
  }, []);

  return status;
}
