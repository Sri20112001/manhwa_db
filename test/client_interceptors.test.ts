import './setup';
import test from 'node:test';
import assert from 'node:assert/strict';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { apiRequest } from '@/api/client';
import { clearCache, getCacheEntry } from '@/api/cache';
import { useRootStore } from '@/logic/store';
import { API_BASE_URL } from '@/shared/constants/config';

function ok(config: InternalAxiosRequestConfig, body: unknown): Promise<AxiosResponse> {
  return Promise.resolve({
    data: body,
    status: 200,
    statusText: 'OK',
    headers: { 'cache-control': 'private, max-age=60', etag: 'W/"e1"' },
    config,
  });
}

test('Client - stamps the active accountId on private cache entries', async () => {
  clearCache();
  useRootStore.getState().setSession({ uid: 'user-Z', username: 'zed', scopes: [] });

  await apiRequest({
    url: '/me',
    adapter: (config) => ok(config, { data: { uid: 'user-Z' }, requestId: 'r1' }),
  });

  const entry = getCacheEntry(`[user:user-Z] GET ${API_BASE_URL}/me?`);

  assert.ok(entry, 'private response should be cached under the account-partitioned key');
  assert.equal(entry.accountId, 'user-Z', 'accountId must be recorded, not null');
  assert.equal(entry.etag, 'W/"e1"');
  assert.equal(entry.maxAge, 60);
});

test('Client - revalidates with If-None-Match and replays the cached 304 payload', async () => {
  clearCache();
  useRootStore.getState().setSession({ uid: 'user-Z', username: 'zed', scopes: [] });

  const envelope = { data: { uid: 'user-Z' }, requestId: 'r1' };
  await apiRequest({
    url: '/me',
    adapter: (config) => ok(config, envelope),
  });

  let sentIfNoneMatch: unknown;
  const replayed = await apiRequest<typeof envelope>({
    url: '/me',
    adapter: (config) => {
      sentIfNoneMatch = config.headers.get('If-None-Match');
      return Promise.resolve({
        data: undefined,
        status: 304,
        statusText: 'Not Modified',
        headers: {},
        config,
      });
    },
  });

  assert.equal(sentIfNoneMatch, 'W/"e1"', 'conditional revalidation header must be sent');
  assert.deepEqual(replayed, envelope, '304 must replay the cached payload');
});

test('Client - does not cache responses marked no-store', async () => {
  clearCache();
  useRootStore.getState().setSession({ uid: 'user-Z', username: 'zed', scopes: [] });

  await apiRequest({
    url: '/me/tracking',
    adapter: (config) =>
      Promise.resolve({
        data: { data: [], requestId: 'r2' },
        status: 200,
        statusText: 'OK',
        headers: { 'cache-control': 'no-store' },
        config,
      }),
  });

  assert.equal(getCacheEntry(`[user:user-Z] GET ${API_BASE_URL}/me/tracking?`), undefined);
});
