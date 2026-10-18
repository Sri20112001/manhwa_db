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

async function readPlaintextKey(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(API_KEY_SLOT);
  } catch {
    return null;
  }
}

async function writePlaintextKey(key: string): Promise<void> {
  try {
    await AsyncStorage.setItem(API_KEY_SLOT, key);
  } catch {
    // The in-memory cache is authoritative for this session.
  }
}

async function dropPlaintextKey(): Promise<void> {
  try {
    await AsyncStorage.removeItem(API_KEY_SLOT);
  } catch {
    // Nothing persisted to remove.
  }
}

export async function loadApiKey(): Promise<string | null> {
  if (cached !== undefined) return cached;
  cached = null;

  const secure = await canUseSecureStore();
  if (secure) {
    try {
      cached = await SecureStore.getItemAsync(API_KEY_SLOT);
    } catch {
      cached = null;
    }
  }

  if (!cached) {
    cached = await readPlaintextKey();
    if (cached && secure) {
      try {
        await SecureStore.setItemAsync(API_KEY_SLOT, cached, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
        await dropPlaintextKey();
      } catch {
        // Keep the plaintext copy when migration to the keychain fails.
      }
    }
  }

  return cached ?? null;
}

export function peekApiKey(): string | null {
  return cached ?? null;
}

export async function saveApiKey(key: string): Promise<void> {
  cached = key;

  if (await canUseSecureStore()) {
    try {
      await SecureStore.setItemAsync(API_KEY_SLOT, key, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      await dropPlaintextKey();
      return;
    } catch {
      // Fall through to the plaintext fallback below.
    }
  }

  await writePlaintextKey(key);
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

  await dropPlaintextKey();
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
