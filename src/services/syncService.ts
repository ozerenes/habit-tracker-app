/**
 * Sync service - prepared for future offline sync.
 * Will handle: queue local changes, push when online, pull remote, resolve conflicts.
 */

import NetInfo from '@react-native-community/netinfo';
import { storage } from '@/storage';

export type SyncStatus = 'idle' | 'syncing' | 'error';

export const syncService = {
  /** Check if device is online via NetInfo */
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected === true;
  },

  /** Queue a change for later sync - called by services on mutation */
  async queueForSync(payload: { type: string; data: unknown }): Promise<void> {
    const queue = await storage.getSyncQueue();
    queue.push({ ...payload, queuedAt: Date.now() });
    await storage.setSyncQueue(queue);
  },

  /** Trigger sync - to be implemented when backend exists */
  async sync(): Promise<{ success: boolean; error?: string }> {
    const online = await this.isOnline();
    if (!online) return { success: false, error: 'Offline' };

    // TODO: fetch remote, merge, push local queue, update storage
    return { success: true };
  },
};
