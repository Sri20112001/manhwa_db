import { STORAGE_KEYS, readJson, writeJson } from '@/shared/lib/storage';

export interface CacheEntry {
  etag?: string;
  payload: unknown;
  cachedAt: number;
  maxAge?: number;
  accountId?: string | null;
}

const store = new Map<string, CacheEntry>();
const MAX_ENTRIES = 400;

let hydrated = false;
let persistHandle: ReturnType<typeof setTimeout> | null = null;

function stableParams(params: unknown): string {
  if (!params || typeof params !== 'object') return '';
  const entries = Object.entries(params as Record<string, unknown>)
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([k, v]) => `${k}=${String(v)}`).join('&');
}

export function cacheKey(
  method: string,
  url: string,
  params?: unknown,
  accountId?: string | null,
): string {
  const isPrivate =
    url.includes('/me') || url.includes('/tracking') || url.includes('/notifications');
  const prefix = isPrivate && accountId ? `[user:${accountId}] ` : isPrivate ? '[user:auth] ' : '';
  return `${prefix}${method.toUpperCase()} ${url}?${stableParams(params)}`;
}

export function getCacheEntry(key: string): CacheEntry | undefined {
  return store.get(key);
}

export function setCacheEntry(key: string, entry: CacheEntry): void {
  if (!store.has(key) && store.size >= MAX_ENTRIES) {
    let oldestKey: string | undefined;
    let oldestAt = Number.POSITIVE_INFINITY;
    for (const [candidate, value] of store) {
      if (value.cachedAt < oldestAt) {
        oldestAt = value.cachedAt;
        oldestKey = candidate;
      }
    }
    if (oldestKey !== undefined) store.delete(oldestKey);
  }
  store.set(key, entry);
  schedulePersist();
}

export function isFresh(entry: CacheEntry): boolean {
  if (entry.maxAge == null) return false;
  return Date.now() - entry.cachedAt < entry.maxAge * 1000;
}

export function clearCache(): void {
  store.clear();
  schedulePersist();
}

export function clearUserCache(targetAccountId?: string): void {
  for (const [key, entry] of store.entries()) {
    const isUserKey = key.startsWith('[user:');
    const matchesAccount =
      !targetAccountId ||
      entry.accountId === targetAccountId ||
      key.startsWith(`[user:${targetAccountId}]`);
    if (isUserKey && matchesAccount) {
      store.delete(key);
    }
  }
  schedulePersist();
}

export function cacheEntryCount(): number {
  return store.size;
}

async function persist(): Promise<void> {
  const snapshot: Record<string, CacheEntry> = {};
  for (const [key, entry] of store) snapshot[key] = entry;
  await writeJson(STORAGE_KEYS.etagCache, snapshot);
}

function schedulePersist(): void {
  if (persistHandle) return;
  persistHandle = setTimeout(() => {
    persistHandle = null;
    void persist();
  }, 1_500);
}

export async function hydrateCache(): Promise<void> {
  if (hydrated) return;
  hydrated = true;
  try {
    const snapshot = await readJson<Record<string, CacheEntry>>(STORAGE_KEYS.etagCache);
    if (!snapshot) return;
    Object.entries(snapshot)
      .filter(([, entry]) => entry && typeof entry === 'object')
      .sort((a, b) => (b[1].cachedAt ?? 0) - (a[1].cachedAt ?? 0))
      .slice(0, MAX_ENTRIES)
      .forEach(([key, entry]) => {
        store.set(key, entry);
      });
  } catch {
    // Degrade gracefully if storage read fails
  }
}

export function __resetHydrationForTesting(): void {
  hydrated = false;
}

export function parseMaxAge(cacheControl: unknown): number | undefined {
  if (typeof cacheControl !== 'string') return undefined;
  const match = /max-age=(\d+)/.exec(cacheControl);
  if (!match || !match[1]) return undefined;
  return Number(match[1]);
}

export function isNoStore(cacheControl: unknown): boolean {
  return typeof cacheControl === 'string' && cacheControl.includes('no-store');
}
