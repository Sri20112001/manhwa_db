import type { StateCreator } from 'zustand';

import { toggleBookmarkInList } from '@/logic/bookmarks/selectors';
import { DEFAULT_BOOKMARK_FILTERS } from '@/shared/types/filters';
import type { BookmarkFilters, BookmarkSort } from '@/shared/types/filters';
import type { ChapterBookmark } from '@/shared/types/models';

import type { RootState } from './index';

export interface BookmarksSlice {
  bookmarks: ChapterBookmark[];
  bookmarkSort: BookmarkSort;
  bookmarkFilters: BookmarkFilters;
  /** Toggles a bookmark and reports whether the chapter is now saved. */
  toggleChapterBookmark: (bookmark: ChapterBookmark) => boolean;
  removeChapterBookmark: (id: string, accountId: string | null) => void;
  clearAccountBookmarks: (accountId: string | null) => void;
  setBookmarkSort: (sort: BookmarkSort) => void;
  patchBookmarkFilters: (patch: Partial<BookmarkFilters>) => void;
  toggleBookmarkSeriesFilter: (slug: string) => void;
  toggleBookmarkTagFilter: (tag: string) => void;
  resetBookmarkFilters: () => void;
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export const createBookmarksSlice: StateCreator<RootState, [], [], BookmarksSlice> = (
  set,
  get,
) => ({
  bookmarks: [],
  bookmarkSort: 'recent',
  bookmarkFilters: { ...DEFAULT_BOOKMARK_FILTERS },
  toggleChapterBookmark: (bookmark) => {
    const exists = get().bookmarks.some(
      (item) => item.id === bookmark.id && item.accountId === bookmark.accountId,
    );
    set((state) => ({ bookmarks: toggleBookmarkInList(state.bookmarks, bookmark) }));
    return !exists;
  },
  removeChapterBookmark: (id, accountId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter(
        (item) => !(item.id === id && item.accountId === accountId),
      ),
    })),
  clearAccountBookmarks: (accountId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((item) => item.accountId !== accountId),
    })),
  setBookmarkSort: (bookmarkSort) => set({ bookmarkSort }),
  patchBookmarkFilters: (patch) =>
    set((state) => ({ bookmarkFilters: { ...state.bookmarkFilters, ...patch } })),
  toggleBookmarkSeriesFilter: (slug) =>
    set((state) => ({
      bookmarkFilters: {
        ...state.bookmarkFilters,
        series: toggleValue(state.bookmarkFilters.series, slug),
      },
    })),
  toggleBookmarkTagFilter: (tag) =>
    set((state) => ({
      bookmarkFilters: {
        ...state.bookmarkFilters,
        tags: toggleValue(state.bookmarkFilters.tags, tag),
      },
    })),
  resetBookmarkFilters: () => set({ bookmarkFilters: { ...DEFAULT_BOOKMARK_FILTERS } }),
});
