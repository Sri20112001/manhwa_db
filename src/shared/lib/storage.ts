import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  rootStore: 'phdb.store.v1',
  queryCache: 'phdb.query-cache.v1',
  writeQueue: 'phdb.write-queue.v1',
  etagCache: 'phdb.etag-cache.v1',
} as const;

export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage pressure is non-fatal; the in-memory state remains authoritative.
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Ignore removal failures.
  }
}

export async function clearAll(key?: string): Promise<void> {
  if (key) {
    await removeKey(key);
    return;
  }
  const keys = await AsyncStorage.getAllKeys();
  const ours = keys.filter((k) => k.startsWith('phdb.'));
  if (ours.length) await AsyncStorage.multiRemove(ours);
}

export async function estimateCacheBytes(): Promise<number> {
  try {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith('phdb.'));
    if (!keys.length) return 0;
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs.reduce((total, [, value]) => total + (value ? value.length : 0), 0);
  } catch {
    return 0;
  }
}
