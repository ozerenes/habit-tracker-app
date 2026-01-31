/**
 * Triggers sync when app comes online. No UI - side effect only.
 */

import { useEffect, useRef } from 'react';
import { useNetworkStatus } from '@/hooks';
import { syncService } from '@/services';

export function SyncOnReconnect() {
  const { isReachable } = useNetworkStatus();
  const wasReachable = useRef<boolean | null>(null);

  useEffect(() => {
    if (isReachable && wasReachable.current === false) {
      syncService.sync();
    }
    wasReachable.current = isReachable;
  }, [isReachable]);

  return null;
}
