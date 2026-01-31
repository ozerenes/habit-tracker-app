/**
 * Storage adapter - clean abstraction over key-value persistence.
 * Swap implementation for testing or different backends.
 */

export type StorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiRemove(keys: string[]): Promise<void>;
};

export type JsonStorageAdapter<T> = {
  get(): Promise<T | null>;
  set(value: T): Promise<void>;
  remove(): Promise<void>;
};

export function createJsonStorage<T>(base: StorageAdapter, key: string): JsonStorageAdapter<T> {
  return {
    async get(): Promise<T | null> {
      const raw = await base.getItem(key);
      if (raw == null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    async set(value: T): Promise<void> {
      await base.setItem(key, JSON.stringify(value));
    },
    async remove(): Promise<void> {
      await base.removeItem(key);
    },
  };
}
