import './setup';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clearCache,
  getCacheEntry,
  hydrateCache,
  isFresh,
  isNoStore,
  parseMaxAge,
  __resetHydrationForTesting,
} from '@/api/cache';
import { STORAGE_KEYS, writeJson } from '@/shared/lib/storage';

test('Cache Hydration - Restores valid cached entries from persistent storage', async () => {
  clearCache();
  __resetHydrationForTesting();

  const now = Date.now();
  await writeJson(STORAGE_KEYS.etagCache, {
    'GET /pornhwa?page=1': {
      etag: 'W/"abc123"',
      payload: { titles: ['Title A', 'Title B'] },
      cachedAt: now,
      maxAge: 3600,
    },
    '[user:usr-99] GET /me?': {
      etag: 'W/"user-profile"',
      payload: { username: 'testuser' },
      cachedAt: now,
      accountId: 'usr-99',
    },
  });

  await hydrateCache();

  const publicEntry = getCacheEntry('GET /pornhwa?page=1');
  const userEntry = getCacheEntry('[user:usr-99] GET /me?');

  assert.ok(publicEntry, 'Public entry should be hydrated');
  assert.equal(publicEntry?.etag, 'W/"abc123"');
  assert.deepEqual(publicEntry?.payload, { titles: ['Title A', 'Title B'] });

  assert.ok(userEntry, 'User entry should be hydrated');
  assert.equal(userEntry?.etag, 'W/"user-profile"');
  assert.equal(userEntry?.accountId, 'usr-99');
});

test('Cache Hydration - Handles malformed or non-object storage gracefully', async () => {
  clearCache();
  __resetHydrationForTesting();

  // Write malformed/unexpected primitive
  await writeJson(STORAGE_KEYS.etagCache, 'this-is-not-an-object');

  // Should not throw
  await assert.doesNotReject(async () => {
    await hydrateCache();
  });

  // Write object with invalid entries (nulls/primitives)
  __resetHydrationForTesting();
  await writeJson(STORAGE_KEYS.etagCache, {
    corruptedEntry: null,
    anotherBad: 12345,
    validEntry: {
      etag: 'valid-etag',
      payload: { ok: true },
      cachedAt: Date.now(),
    },
  });

  await hydrateCache();

  assert.equal(getCacheEntry('corruptedEntry'), undefined);
  assert.equal(getCacheEntry('anotherBad'), undefined);
  assert.ok(getCacheEntry('validEntry'));
});

test('Cache Helpers - parseMaxAge, isNoStore, and isFresh', () => {
  // parseMaxAge
  assert.equal(parseMaxAge('public, max-age=3600'), 3600);
  assert.equal(parseMaxAge('max-age=0, must-revalidate'), 0);
  assert.equal(parseMaxAge('no-cache'), undefined);
  assert.equal(parseMaxAge(null), undefined);
  assert.equal(parseMaxAge(123), undefined);

  // isNoStore
  assert.equal(isNoStore('no-store, no-cache'), true);
  assert.equal(isNoStore('public, max-age=3600'), false);
  assert.equal(isNoStore(undefined), false);

  // isFresh
  const now = Date.now();
  assert.equal(
    isFresh({ payload: {}, cachedAt: now - 5000, maxAge: 10 }),
    true,
    'Entry within maxAge should be fresh',
  );
  assert.equal(
    isFresh({ payload: {}, cachedAt: now - 15000, maxAge: 10 }),
    false,
    'Entry older than maxAge should not be fresh',
  );
  assert.equal(
    isFresh({ payload: {}, cachedAt: now }),
    false,
    'Entry without maxAge should default to not fresh (requires revalidation)',
  );
});
