import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_KEY_SLOT = 'phdb.api-key';

let cached: string | null | undefined;

async function canUseSecureStore(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function loadApiKey(): Promise<string | null> {
  if (cached !== undefined) return cached;
  try {
    if (await canUseSecureStore()) {
      cached = await SecureStore.getItemAsync(API_KEY_SLOT);
    } else {
      cached = await AsyncStorage.getItem(API_KEY_SLOT);
    }
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
  try {
    if (await canUseSecureStore()) {
      await SecureStore.setItemAsync(API_KEY_SLOT, key, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      return;
    }
  } catch {
    // If SecureStore fails unexpectedly, fall through to AsyncStorage fallback
  }

  try {
    await AsyncStorage.setItem(API_KEY_SLOT, key);
  } catch {
    // In-memory cache is already updated
  }
}

export async function clearApiKey(): Promise<void> {
  cached = null;
  try {
    if (await canUseSecureStore()) {
      await SecureStore.deleteItemAsync(API_KEY_SLOT);
    }
  } catch {
    // ignore
  }

  try {
    await AsyncStorage.removeItem(API_KEY_SLOT);
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
