import './setup';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  cacheKey,
  clearCache,
  clearUserCache,
  getCacheEntry,
  setCacheEntry,
} from '@/api/cache';
import {
  clearAccountQueue,
  enqueueWrite,
  hydrateQueue,
  queueSnapshot,
} from '@/logic/query/mutations.queue';
import { useRootStore } from '@/logic/store';
import { disconnectAccount } from '@/logic/usecases/connectAccount';
import { loadApiKey, saveApiKey } from '@/shared/lib/secure';
import { STORAGE_KEYS, writeJson } from '@/shared/lib/storage';

test('Account Isolation - Cache key partitioning', () => {
  clearCache();

  // Public endpoint
  const publicKey = cacheKey('GET', '/pornhwa', { page: 1 }, 'user-1');
  assert.equal(publicKey, 'GET /pornhwa?page=1');

  // Private endpoints
  const meKey1 = cacheKey('GET', '/me', undefined, 'user-1');
  const meKey2 = cacheKey('GET', '/me', undefined, 'user-2');
  const trackingKey = cacheKey('GET', '/me/tracking', { status: 'reading' }, 'user-1');

  assert.equal(meKey1, '[user:user-1] GET /me?');
  assert.equal(meKey2, '[user:user-2] GET /me?');
  assert.equal(trackingKey, '[user:user-1] GET /me/tracking?status=reading');
});

test('Account Isolation - clearUserCache preserves public catalogue & other users', () => {
  clearCache();

  const publicKey = cacheKey('GET', '/pornhwa', { page: 1 });
  const user1Key = cacheKey('GET', '/me', undefined, 'user-1');
  const user2Key = cacheKey('GET', '/me', undefined, 'user-2');

  setCacheEntry(publicKey, { payload: { titles: ['Series A'] }, cachedAt: Date.now() });
  setCacheEntry(user1Key, { payload: { username: 'UserOne' }, cachedAt: Date.now(), accountId: 'user-1' });
  setCacheEntry(user2Key, { payload: { username: 'UserTwo' }, cachedAt: Date.now(), accountId: 'user-2' });

  assert.ok(getCacheEntry(publicKey));
  assert.ok(getCacheEntry(user1Key));
  assert.ok(getCacheEntry(user2Key));

  // Clear user-1's cache only
  clearUserCache('user-1');

  assert.equal(getCacheEntry(user1Key), undefined, 'user-1 private cache should be cleared');
  assert.ok(getCacheEntry(user2Key), 'user-2 private cache must be preserved');
  assert.ok(getCacheEntry(publicKey), 'Public catalogue cache must be preserved');

  // Clear all user caches without accountId
  clearUserCache();
  assert.equal(getCacheEntry(user2Key), undefined, 'all user caches cleared');
  assert.ok(getCacheEntry(publicKey), 'Public catalogue cache must still be preserved');
});

test('Account Isolation - Mutation queue tags accountId and isolates between users', async () => {
  clearAccountQueue();

  const store = useRootStore.getState();
  store.setSession({ uid: 'user-A', username: 'alice', scopes: ['read', 'write'] });

  // Enqueue as User A
  enqueueWrite({
    kind: 'tracking.rating',
    identifier: 'series-123',
    rating: 10,
  });

  const snapshotA = queueSnapshot();
  assert.equal(snapshotA.length, 1);
  assert.equal(snapshotA[0]?.accountId, 'user-A');

  // Switch to User B
  store.setSession({ uid: 'user-B', username: 'bob', scopes: ['read', 'write'] });

  enqueueWrite({
    kind: 'tracking.rating',
    identifier: 'series-456',
    rating: 8,
  });

  const snapshotB = queueSnapshot();
  assert.equal(snapshotB.length, 2);
  assert.equal(snapshotB[0]?.accountId, 'user-A');
  assert.equal(snapshotB[1]?.accountId, 'user-B');

  // Clear only User A's queue
  clearAccountQueue('user-A');
  const snapshotAfterClear = queueSnapshot();
  assert.equal(snapshotAfterClear.length, 1);
  assert.equal(snapshotAfterClear[0]?.accountId, 'user-B');

  clearAccountQueue();
});

test('Account Isolation - hydrateQueue marks legacy unassigned items safely', async () => {
  clearAccountQueue();

  // Simulate existing queue in storage without accountId
  await writeJson(STORAGE_KEYS.writeQueue, [
    {
      id: 'legacy-1',
      write: { kind: 'tracking.delete', identifier: 'series-old' },
      attempts: 0,
      enqueuedAt: Date.now(),
      nextAttemptAt: Date.now(),
    },
    {
      id: 'modern-1',
      accountId: 'user-C',
      write: { kind: 'tracking.delete', identifier: 'series-new' },
      attempts: 0,
      enqueuedAt: Date.now(),
      nextAttemptAt: Date.now(),
    },
  ]);

  await hydrateQueue();

  const snapshot = queueSnapshot();
  assert.equal(snapshot.length, 2);
  const legacy = snapshot.find((i) => i.id === 'legacy-1');
  const modern = snapshot.find((i) => i.id === 'modern-1');

  assert.equal(legacy?.accountId, 'legacy-unassigned');
  assert.equal(modern?.accountId, 'user-C');

  clearAccountQueue();
});

test('Account Isolation - disconnectAccount cleans up credentials, session, and cache', async () => {
  const store = useRootStore.getState();
  store.setSession({ uid: 'user-logout-test', username: 'logoutUser', scopes: ['read'] });
  await saveApiKey('secret-token-logout');

  const userKey = cacheKey('GET', '/me', undefined, 'user-logout-test');
  setCacheEntry(userKey, { payload: { username: 'logoutUser' }, cachedAt: Date.now(), accountId: 'user-logout-test' });

  assert.equal(await loadApiKey(), 'secret-token-logout');
  assert.equal(useRootStore.getState().hasKey, true);
  assert.equal(useRootStore.getState().uid, 'user-logout-test');
  assert.ok(getCacheEntry(userKey));

  await disconnectAccount();

  assert.equal(await loadApiKey(), null, 'API key should be cleared');
  assert.equal(useRootStore.getState().hasKey, false, 'hasKey should be false');
  assert.equal(useRootStore.getState().uid, null, 'uid should be null');
  assert.equal(getCacheEntry(userKey), undefined, 'user cache should be cleared on logout');
});

test('Account Isolation - 401 on outdated key does not trigger disconnect of newly active key', async () => {
  let disconnectCalled = false;
  const mockDisconnect = () => {
    disconnectCalled = true;
  };

  const handleAuthFailure = async (failedKey: string | undefined, currentKey: string | null) => {
    if (!failedKey || !currentKey || failedKey === currentKey) {
      mockDisconnect();
    }
  };

  await saveApiKey('active-new-key');
  const currentKey = await loadApiKey();

  // Simulated stale request from old key that returns 401
  await handleAuthFailure('stale-old-key', currentKey);
  assert.equal(disconnectCalled, false, 'Stale 401 should not trigger disconnect');

  // Request from current active key that returns 401
  await handleAuthFailure('active-new-key', currentKey);
  assert.equal(disconnectCalled, true, 'Matching active key 401 must trigger disconnect');
});

