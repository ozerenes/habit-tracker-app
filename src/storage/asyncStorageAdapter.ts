/**
 * AsyncStorage implementation of StorageAdapter
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageAdapter } from './adapter';

export const asyncStorageAdapter: StorageAdapter = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
  getAllKeys: () => AsyncStorage.getAllKeys(),
  multiRemove: (keys: string[]) => AsyncStorage.multiRemove(keys),
};
