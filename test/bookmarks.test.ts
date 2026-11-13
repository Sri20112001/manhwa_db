import './setup';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  activeBookmarkFilterCount,
  bookmarkKey,
  bookmarkSeriesOptions,
  bookmarkTagOptions,
  filterAndSortBookmarks,
  toggleBookmarkInList,
} from '@/logic/bookmarks/selectors';
import { useRootStore } from '@/logic/store';
import { DEFAULT_BOOKMARK_FILTERS, type BookmarkFilters } from '@/shared/types/filters';
import type { ChapterBookmark } from '@/shared/types/models';

function makeBookmark(
  overrides: Partial<ChapterBookmark> &
    Pick<ChapterBookmark, 'id' | 'seriesTitle' | 'chapterStart'>,
): ChapterBookmark {
  return {
    accountId: 'user-1',
    pornhwaId: 1,
    slug: 'series-a',
    coverImage: null,
    chapterEnd: null,
    chapterTitle: null,
    description: null,
    tags: [],
    bookmarkedAt: 0,
    ...overrides,
  };
}

function withFilters(patch: Partial<BookmarkFilters>): BookmarkFilters {
  return { ...DEFAULT_BOOKMARK_FILTERS, ...patch };
}

const CHAPTERS: ChapterBookmark[] = [
  makeBookmark({
    id: bookmarkKey(1, 3),
    pornhwaId: 1,
    slug: 'alpha',
    seriesTitle: 'Alpha Story',
    chapterStart: 3,
    chapterTitle: 'Chapter 3',
    description: 'A tense office confrontation',
    tags: ['Office', 'Drama'],
    bookmarkedAt: 300,
  }),
  makeBookmark({
    id: bookmarkKey(2, 12),
    pornhwaId: 2,
    slug: 'beta',
    seriesTitle: 'Beta Days',
    chapterStart: 12,
    chapterTitle: 'Chapter 12 – Reunion',
    description: 'A college reunion',
    tags: ['College', 'Romance'],
    bookmarkedAt: 100,
  }),
  makeBookmark({
    id: bookmarkKey(3, 5),
    pornhwaId: 3,
    slug: 'gamma',
    seriesTitle: 'Gamma Zone',
    chapterStart: 5,
    chapterTitle: 'Chapter 5',
    description: 'Office rivalry',
    tags: ['Office'],
    bookmarkedAt: 200,
  }),
];

test('Bookmarks - stable key combines series id and chapter number', () => {
  assert.equal(bookmarkKey(42, 7), '42:7');
  assert.notEqual(bookmarkKey(42, 7), bookmarkKey(42, 8));
});

test('Bookmarks - toggle adds newest first and removes on second press', () => {
  const first = makeBookmark({ id: bookmarkKey(1, 1), seriesTitle: 'A', chapterStart: 1 });
  const second = makeBookmark({ id: bookmarkKey(1, 2), seriesTitle: 'A', chapterStart: 2 });

  const added = toggleBookmarkInList([], first);
  assert.deepEqual(
    added.map((b) => b.id),
    [first.id],
  );

  const two = toggleBookmarkInList(added, second);
  assert.deepEqual(
    two.map((b) => b.id),
    [second.id, first.id],
  );

  const removed = toggleBookmarkInList(two, first);
  assert.deepEqual(
    removed.map((b) => b.id),
    [second.id],
  );
});

test('Bookmarks - same chapter on different accounts does not collide', () => {
  const a = makeBookmark({
    id: bookmarkKey(1, 1),
    seriesTitle: 'A',
    chapterStart: 1,
    accountId: 'user-1',
  });
  const b = makeBookmark({
    id: bookmarkKey(1, 1),
    seriesTitle: 'A',
    chapterStart: 1,
    accountId: 'user-2',
  });

  const list = toggleBookmarkInList(toggleBookmarkInList([], a), b);
  assert.equal(list.length, 2);
});

test('Bookmarks - search matches series, chapter title, description, and tags', () => {
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, withFilters({ query: 'beta' }), 'recent').map((b) => b.id),
    [bookmarkKey(2, 12)],
  );
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, withFilters({ query: 'chapter 5' }), 'recent').map(
      (b) => b.id,
    ),
    [bookmarkKey(3, 5)],
  );
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, withFilters({ query: 'reunion' }), 'recent').map((b) => b.id),
    [bookmarkKey(2, 12)],
  );
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, withFilters({ query: 'romance' }), 'recent').map((b) => b.id),
    [bookmarkKey(2, 12)],
  );
});

test('Bookmarks - series filter is exclusive and tag filter matches any selected tag', () => {
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, withFilters({ series: ['alpha', 'gamma'] }), 'recent').map(
      (b) => b.id,
    ),
    [bookmarkKey(1, 3), bookmarkKey(3, 5)],
  );

  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, withFilters({ tags: ['Drama', 'College'] }), 'recent').map(
      (b) => b.id,
    ),
    [bookmarkKey(1, 3), bookmarkKey(2, 12)],
  );
});

test('Bookmarks - filters combine with search', () => {
  const ids = filterAndSortBookmarks(
    CHAPTERS,
    withFilters({ query: 'office', tags: ['Drama'] }),
    'recent',
  ).map((b) => b.id);

  assert.deepEqual(ids, [bookmarkKey(1, 3)]);
});

test('Bookmarks - every sort order is deterministic', () => {
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, DEFAULT_BOOKMARK_FILTERS, 'recent').map((b) => b.id),
    [bookmarkKey(1, 3), bookmarkKey(3, 5), bookmarkKey(2, 12)],
  );
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, DEFAULT_BOOKMARK_FILTERS, 'oldest').map((b) => b.id),
    [bookmarkKey(2, 12), bookmarkKey(3, 5), bookmarkKey(1, 3)],
  );
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, DEFAULT_BOOKMARK_FILTERS, 'series').map((b) => b.id),
    [bookmarkKey(1, 3), bookmarkKey(2, 12), bookmarkKey(3, 5)],
  );
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, DEFAULT_BOOKMARK_FILTERS, 'chapter_asc').map((b) => b.id),
    [bookmarkKey(1, 3), bookmarkKey(3, 5), bookmarkKey(2, 12)],
  );
  assert.deepEqual(
    filterAndSortBookmarks(CHAPTERS, DEFAULT_BOOKMARK_FILTERS, 'chapter_desc').map((b) => b.id),
    [bookmarkKey(2, 12), bookmarkKey(3, 5), bookmarkKey(1, 3)],
  );
});

test('Bookmarks - filter options are unique, counted, and sorted', () => {
  const series = bookmarkSeriesOptions(CHAPTERS);
  assert.deepEqual(
    series.map((option) => [option.slug, option.title, option.count]),
    [
      ['alpha', 'Alpha Story', 1],
      ['beta', 'Beta Days', 1],
      ['gamma', 'Gamma Zone', 1],
    ],
  );

  const tags = bookmarkTagOptions(CHAPTERS);
  assert.deepEqual(
    tags.map((option) => [option.tag, option.count]),
    [
      ['College', 1],
      ['Drama', 1],
      ['Office', 2],
      ['Romance', 1],
    ],
  );

  assert.equal(activeBookmarkFilterCount(withFilters({ query: ' office ', tags: ['Office'] })), 2);
  assert.equal(activeBookmarkFilterCount(DEFAULT_BOOKMARK_FILTERS), 0);
});

test('Bookmarks - store toggles, removes, and isolates by account', () => {
  useRootStore.setState({ bookmarks: [] });
  const store = useRootStore.getState();

  const bookmark = makeBookmark({
    id: bookmarkKey(9, 4),
    pornhwaId: 9,
    slug: 'store-series',
    seriesTitle: 'Store Series',
    chapterStart: 4,
    bookmarkedAt: 1_000,
    accountId: 'user-A',
  });

  assert.equal(store.toggleChapterBookmark(bookmark), true);
  assert.equal(useRootStore.getState().bookmarks.length, 1);

  assert.equal(store.toggleChapterBookmark(bookmark), false);
  assert.equal(useRootStore.getState().bookmarks.length, 0);

  store.toggleChapterBookmark(bookmark);
  store.toggleChapterBookmark({ ...bookmark, accountId: 'user-B' });
  assert.equal(useRootStore.getState().bookmarks.length, 2);

  store.removeChapterBookmark(bookmark.id, 'user-A');
  const remaining = useRootStore.getState().bookmarks;
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0]?.accountId, 'user-B');

  store.clearAccountBookmarks('user-B');
  assert.equal(useRootStore.getState().bookmarks.length, 0);
});
