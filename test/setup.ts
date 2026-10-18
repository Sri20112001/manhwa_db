// Polyfill window and localStorage for @react-native-async-storage/async-storage in Node environment
import Module from 'node:module';

const storageMap = new Map<string, string>();

const mockLocalStorage = {
  getItem: (key: string): string | null => {
    return storageMap.get(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    storageMap.set(key, String(value));
  },
  removeItem: (key: string): void => {
    storageMap.delete(key);
  },
  clear: (): void => {
    storageMap.clear();
  },
  key: (index: number): string | null => {
    return Array.from(storageMap.keys())[index] ?? null;
  },
  get length(): number {
    return storageMap.size;
  },
};

(globalThis as unknown as { window: unknown }).window = {
  localStorage: mockLocalStorage,
};

// Mock native-only modules in Node test runner
const mockSecureStore = {
  isAvailableAsync: async () => false,
  getItemAsync: async () => null,
  setItemAsync: async () => {},
  deleteItemAsync: async () => {},
  WHEN_UNLOCKED: 'WHEN_UNLOCKED',
};

const anyModule = Module as unknown as {
  _load: (request: string, parent: unknown, isMain: boolean) => unknown;
  _resolveFilename: (request: string, parent: unknown, isMain: boolean, options?: unknown) => string;
};

const originalResolveFilename = anyModule._resolveFilename;
anyModule._resolveFilename = function (request: string, parent: unknown, isMain: boolean, options?: unknown) {
  if (request === 'react-native') {
    return originalResolveFilename.call(this, 'react-native-web', parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const originalLoad = anyModule._load;
anyModule._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'expo-secure-store') {
    return mockSecureStore;
  }
  // eslint-disable-next-line prefer-rest-params
  return originalLoad.apply(this, arguments as unknown as [string, unknown, boolean]);
};

export function clearMockStorage(): void {
  storageMap.clear();
}

export { storageMap };
