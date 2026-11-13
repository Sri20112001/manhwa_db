import './setup';
import test from 'node:test';
import assert from 'node:assert/strict';

import { buildGalleryParams } from '@/api/endpoints/gallery';

test('Gallery params - applies defaults', () => {
  assert.deepEqual(buildGalleryParams(), { limit: 24, sort: 'newest' });
});

test('Gallery params - normalizes search, ids, and cursor', () => {
  assert.deepEqual(
    buildGalleryParams({
      limit: 10,
      sort: 'popular_all',
      cursor: 'abc123',
      search: '  secret  ',
      pornhwaIds: [191, 149],
      characterIds: [6498],
      tagIds: [27],
      orientation: 'yuri',
    }),
    {
      limit: 10,
      sort: 'popular_all',
      cursor: 'abc123',
      search: 'secret',
      pornhwaIds: '191,149',
      characterIds: '6498',
      tagIds: '27',
      orientation: 'yuri',
    },
  );
});

test('Gallery params - omits empty values', () => {
  assert.deepEqual(
    buildGalleryParams({
      search: '   ',
      pornhwaIds: [],
      characterIds: [],
      tagIds: [],
      cursor: null,
    }),
    { limit: 24, sort: 'newest' },
  );
});
