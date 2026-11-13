import type { BookmarkFilters, BookmarkSort } from '@/shared/types/filters';
import type { ChapterBookmark } from '@/shared/types/models';

export interface BookmarkSeriesOption {
  slug: string;
  title: string;
  count: number;
}

export interface BookmarkTagOption {
  tag: string;
  count: number;
}

export function bookmarkKey(pornhwaId: number, chapterStart: number): string {
  return `${pornhwaId}:${chapterStart}`;
}

export function isSameBookmark(a: ChapterBookmark, b: ChapterBookmark): boolean {
  return a.id === b.id && a.accountId === b.accountId;
}

/**
 * Adds the bookmark when it does not exist yet, otherwise removes it.
 * The newest bookmark is placed first so the default "recent" sort is instant.
 */
export function toggleBookmarkInList(
  bookmarks: ChapterBookmark[],
  bookmark: ChapterBookmark,
): ChapterBookmark[] {
  if (bookmarks.some((item) => isSameBookmark(item, bookmark))) {
    return bookmarks.filter((item) => !isSameBookmark(item, bookmark));
  }
  return [bookmark, ...bookmarks];
}

function compareBySort(a: ChapterBookmark, b: ChapterBookmark, sort: BookmarkSort): number {
  switch (sort) {
    case 'oldest':
      return a.bookmarkedAt - b.bookmarkedAt;
    case 'series':
      return (
        a.seriesTitle.localeCompare(b.seriesTitle, undefined, { sensitivity: 'base' }) ||
        a.chapterStart - b.chapterStart
      );
    case 'chapter_asc':
      return (
        a.chapterStart - b.chapterStart ||
        a.seriesTitle.localeCompare(b.seriesTitle, undefined, { sensitivity: 'base' })
      );
    case 'chapter_desc':
      return (
        b.chapterStart - a.chapterStart ||
        a.seriesTitle.localeCompare(b.seriesTitle, undefined, { sensitivity: 'base' })
      );
    case 'recent':
    default:
      return b.bookmarkedAt - a.bookmarkedAt;
  }
}

export function filterBookmarks(
  bookmarks: ChapterBookmark[],
  filters: BookmarkFilters,
): ChapterBookmark[] {
  const query = filters.query.trim().toLowerCase();
  const series = new Set(filters.series);
  const tags = new Set(filters.tags);

  return bookmarks.filter((bookmark) => {
    if (series.size > 0 && !series.has(bookmark.slug)) return false;
    if (tags.size > 0 && !bookmark.tags.some((tag) => tags.has(tag))) return false;
    if (!query) return true;

    const haystack = [
      bookmark.seriesTitle,
      bookmark.chapterTitle,
      bookmark.description,
      `chapter ${bookmark.chapterStart}`,
      `ch ${bookmark.chapterStart}`,
      ...bookmark.tags,
    ]
      .filter((value): value is string => Boolean(value))
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function sortBookmarks(bookmarks: ChapterBookmark[], sort: BookmarkSort): ChapterBookmark[] {
  return [...bookmarks].sort((a, b) => compareBySort(a, b, sort));
}

export function filterAndSortBookmarks(
  bookmarks: ChapterBookmark[],
  filters: BookmarkFilters,
  sort: BookmarkSort,
): ChapterBookmark[] {
  return sortBookmarks(filterBookmarks(bookmarks, filters), sort);
}

export function bookmarkSeriesOptions(bookmarks: ChapterBookmark[]): BookmarkSeriesOption[] {
  const map = new Map<string, BookmarkSeriesOption>();

  for (const bookmark of bookmarks) {
    const existing = map.get(bookmark.slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(bookmark.slug, {
        slug: bookmark.slug,
        title: bookmark.seriesTitle,
        count: 1,
      });
    }
  }

  return [...map.values()].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
  );
}

export function bookmarkTagOptions(bookmarks: ChapterBookmark[]): BookmarkTagOption[] {
  const map = new Map<string, BookmarkTagOption>();

  for (const bookmark of bookmarks) {
    for (const tag of new Set(bookmark.tags)) {
      const existing = map.get(tag);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(tag, { tag, count: 1 });
      }
    }
  }

  return [...map.values()].sort((a, b) =>
    a.tag.localeCompare(b.tag, undefined, { sensitivity: 'base' }),
  );
}

export function activeBookmarkFilterCount(filters: BookmarkFilters): number {
  let count = filters.series.length + filters.tags.length;
  if (filters.query.trim().length > 0) count += 1;
  return count;
}
