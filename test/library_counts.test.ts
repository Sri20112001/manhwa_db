import './setup';
import test from 'node:test';
import assert from 'node:assert/strict';

import { fetchLibraryCounts } from '@/logic/hooks/useLibrary';
import type { TrackingListParams } from '@/api/endpoints/tracking';

test('Library Counts - Single page <= 100 items calculates accurately', async () => {
  let callCount = 0;
  const mockFetcher = async (params: TrackingListParams) => {
    callCount += 1;
    assert.equal(params.page, 1);
    assert.equal(params.limit, 100);

    return {
      data: [
        { id: 1, status: 'reading' },
        { id: 2, status: 'reading' },
        { id: 3, status: 'completed' },
        { id: 4, status: 'on_hold' },
        { id: 5, status: 'dropped' },
        { id: 6, status: 'plan_to_read' },
        { id: 7, status: 're_reading' },
      ] as any,
      pagination: {
        page: 1,
        limit: 100,
        total: 7,
        totalPages: 1,
        hasMore: false,
      },
    };
  };

  const result = await fetchLibraryCounts(mockFetcher as Parameters<typeof fetchLibraryCounts>[0]);

  assert.equal(callCount, 1, 'Fetcher should be called only once');
  assert.equal(result.total, 7);
  assert.equal(result.counts.reading, 2);
  assert.equal(result.counts.completed, 1);
  assert.equal(result.counts.on_hold, 1);
  assert.equal(result.counts.dropped, 1);
  assert.equal(result.counts.plan_to_read, 1);
  assert.equal(result.counts.re_reading, 1);
});

test('Library Counts - Multi-page > 100 items paginates and aggregates all entries', async () => {
  const pageRequests: number[] = [];

  const mockFetcher = async (params: TrackingListParams) => {
    const page = params.page ?? 1;
    pageRequests.push(page);

    if (page === 1) {
      return {
        data: Array.from({ length: 100 }, (_, i) => ({ id: i, status: 'reading' })),
        pagination: {
          page: 1,
          limit: 100,
          total: 250,
          totalPages: 3,
          hasMore: true,
        },
      } as any;
    }

    if (page === 2) {
      return {
        data: Array.from({ length: 100 }, (_, i) => ({ id: 100 + i, status: 'completed' })),
        pagination: {
          page: 2,
          limit: 100,
          total: 250,
          totalPages: 3,
          hasMore: true,
        },
      } as any;
    }

    return {
      data: Array.from({ length: 50 }, (_, i) => ({ id: 200 + i, status: 'on_hold' })),
      pagination: {
        page: 3,
        limit: 100,
        total: 250,
        totalPages: 3,
        hasMore: false,
      },
    } as any;
  };

  const result = await fetchLibraryCounts(mockFetcher as Parameters<typeof fetchLibraryCounts>[0]);

  assert.deepEqual(pageRequests, [1, 2, 3], 'Should request pages 1, 2, and 3 sequentially');
  assert.equal(result.total, 250);
  assert.equal(result.counts.reading, 100);
  assert.equal(result.counts.completed, 100);
  assert.equal(result.counts.on_hold, 50);
  assert.equal(result.counts.dropped, 0);
  assert.equal(result.counts.plan_to_read, 0);
  assert.equal(result.counts.re_reading, 0);
});

test('Library Counts - Empty library returns zero counts', async () => {
  const mockFetcher = async () => ({
    data: [],
    pagination: {
      page: 1,
      limit: 100,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },
  });

  const result = await fetchLibraryCounts(mockFetcher as any);

  assert.equal(result.total, 0);
  assert.deepEqual(result.counts, {
    reading: 0,
    plan_to_read: 0,
    completed: 0,
    on_hold: 0,
    dropped: 0,
    re_reading: 0,
  });
});

test('Library Counts - Handles unknown or missing statuses gracefully', async () => {
  const mockFetcher = async () => ({
    data: [
      { id: 1, status: 'reading' },
      { id: 2, status: 'unknown_status' },
      { id: 3, status: null },
      { id: 4, status: undefined },
    ],
    pagination: {
      page: 1,
      limit: 100,
      total: 4,
      totalPages: 1,
      hasMore: false,
    },
  });

  const result = await fetchLibraryCounts(mockFetcher as any);

  assert.equal(result.total, 4);
  assert.equal(result.counts.reading, 1);
  assert.equal(result.counts.completed, 0);
});
