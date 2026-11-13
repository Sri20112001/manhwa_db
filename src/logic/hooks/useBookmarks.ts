import { useCallback, useMemo } from 'react';

import {
  activeBookmarkFilterCount,
  bookmarkKey,
  bookmarkSeriesOptions,
  bookmarkTagOptions,
  filterAndSortBookmarks,
} from '@/logic/bookmarks/selectors';
import { useRootStore } from '@/logic/store';
import type { ChapterBookmark } from '@/shared/types/models';

export interface ChapterBookmarkInput {
  pornhwaId: number;
  slug: string;
  seriesTitle: string;
  coverImage: string | null;
  chapterStart: number;
  chapterEnd?: number | null;
  chapterTitle?: string | null;
  description?: string | null;
  tags?: string[];
}

/**
 * Reactive bookmark state + toggle for a single chapter.
 * The bookmark snapshots the series/chapter metadata so the saved list can
 * render (and deep-link) even when the catalogue query is not in memory.
 */
export function useChapterBookmark(input: ChapterBookmarkInput) {
  const uid = useRootStore((state) => state.uid);
  const id = bookmarkKey(input.pornhwaId, input.chapterStart);
  const isBookmarked = useRootStore((state) =>
    state.bookmarks.some((item) => item.id === id && item.accountId === uid),
  );
  const toggleChapterBookmark = useRootStore((state) => state.toggleChapterBookmark);
  const pushToast = useRootStore((state) => state.pushToast);

  const enabled =
    input.pornhwaId > 0 &&
    input.chapterStart > 0 &&
    input.slug.length > 0 &&
    input.seriesTitle.length > 0;

  const toggle = useCallback(() => {
    if (!enabled) return;

    const bookmark: ChapterBookmark = {
      id,
      accountId: uid,
      pornhwaId: input.pornhwaId,
      slug: input.slug,
      seriesTitle: input.seriesTitle,
      coverImage: input.coverImage,
      chapterStart: input.chapterStart,
      chapterEnd: input.chapterEnd ?? null,
      chapterTitle: input.chapterTitle ?? null,
      description: input.description ?? null,
      tags: input.tags ? [...input.tags] : [],
      bookmarkedAt: Date.now(),
    };

    const added = toggleChapterBookmark(bookmark);
    pushToast(added ? 'Chapter bookmarked' : 'Bookmark removed', added ? 'success' : 'info');
  }, [
    enabled,
    id,
    uid,
    input.pornhwaId,
    input.slug,
    input.seriesTitle,
    input.coverImage,
    input.chapterStart,
    input.chapterEnd,
    input.chapterTitle,
    input.description,
    input.tags,
    toggleChapterBookmark,
    pushToast,
  ]);

  return { isBookmarked, toggle, enabled };
}

export function useBookmarks() {
  const uid = useRootStore((state) => state.uid);
  const allBookmarks = useRootStore((state) => state.bookmarks);
  const sort = useRootStore((state) => state.bookmarkSort);
  const filters = useRootStore((state) => state.bookmarkFilters);
  const setSort = useRootStore((state) => state.setBookmarkSort);
  const patchFilters = useRootStore((state) => state.patchBookmarkFilters);
  const toggleSeriesFilter = useRootStore((state) => state.toggleBookmarkSeriesFilter);
  const toggleTagFilter = useRootStore((state) => state.toggleBookmarkTagFilter);
  const resetFilters = useRootStore((state) => state.resetBookmarkFilters);
  const removeChapterBookmark = useRootStore((state) => state.removeChapterBookmark);
  const pushToast = useRootStore((state) => state.pushToast);

  const bookmarks = useMemo(
    () => allBookmarks.filter((bookmark) => bookmark.accountId === uid),
    [allBookmarks, uid],
  );

  const visibleBookmarks = useMemo(
    () => filterAndSortBookmarks(bookmarks, filters, sort),
    [bookmarks, filters, sort],
  );

  const seriesOptions = useMemo(() => bookmarkSeriesOptions(bookmarks), [bookmarks]);
  const tagOptions = useMemo(() => bookmarkTagOptions(bookmarks), [bookmarks]);
  const activeFilterCount = activeBookmarkFilterCount(filters);

  const removeBookmark = useCallback(
    (bookmark: ChapterBookmark) => {
      removeChapterBookmark(bookmark.id, bookmark.accountId);
      pushToast('Bookmark removed', 'info');
    },
    [removeChapterBookmark, pushToast],
  );

  return {
    bookmarks,
    visibleBookmarks,
    total: bookmarks.length,
    seriesOptions,
    tagOptions,
    sort,
    filters,
    activeFilterCount,
    setSort,
    patchFilters,
    toggleSeriesFilter,
    toggleTagFilter,
    resetFilters,
    removeBookmark,
  };
}
