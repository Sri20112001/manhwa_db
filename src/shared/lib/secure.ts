import * as SecureStore from 'expo-secure-store';

const API_KEY_SLOT = 'phdb.api-key';

let cached: string | null | undefined;

export async function loadApiKey(): Promise<string | null> {
  if (cached !== undefined) return cached;
  try {
    cached = await SecureStore.getItemAsync(API_KEY_SLOT);
  } catch {
    cached = null;
  }
  return cached;
}

export function peekApiKey(): string | null {
  return cached ?? null;
}

export async function saveApiKey(key: string): Promise<void> {
  cached = key;
  await SecureStore.setItemAsync(API_KEY_SLOT, key, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function clearApiKey(): Promise<void> {
  cached = null;
  try {
    await SecureStore.deleteItemAsync(API_KEY_SLOT);
  } catch {
    // The key may already be gone; clearing memory is sufficient.
  }
}

export async function hasApiKey(): Promise<boolean> {
  return (await loadApiKey()) !== null;
}

export function maskApiKey(key: string | null): string {
  if (!key) return '';
  if (key.length <= 12) return '•'.repeat(key.length);
  const head = key.slice(0, 9);
  const tail = key.slice(-4);
  return `${head}${'•'.repeat(Math.max(4, key.length - head.length - tail.length))}${tail}`;
}
