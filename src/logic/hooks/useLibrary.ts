import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getMyTracking, type TrackingListParams } from '@/api/endpoints/tracking';
import { STALE } from '@/shared/constants/query';
import { TRACKING_STATUSES, type TrackingStatus } from '@/shared/constants/status';
import { toTrackingEntry } from '@/logic/mappers/pornhwa';
import type { LibrarySort, LibraryStatusTab } from '@/shared/types/filters';

import { queryKeys } from '../query/keys';

const SORT_MAP: Record<LibrarySort, NonNullable<TrackingListParams['sort']>> = {
  updated: 'updated_at',
  title: 'title',
  priority: 'priority',
  rating: 'rating',
};

export function useLibrary(statusTab: LibraryStatusTab, sort: LibrarySort) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.tracking({ status: statusTab, sort: SORT_MAP[sort] }),
    staleTime: STALE.tracking,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getMyTracking({
        page: pageParam,
        limit: 40,
        status: statusTab,
        sort: SORT_MAP[sort],
      });
      return { items: page.data.map(toTrackingEntry), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    entries: query.data?.pages.flatMap((page) => page.items) ?? [],
    total: query.data?.pages[0]?.pagination.total ?? 0,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
    isFetchingNextPage: query.isFetchingNextPage,
    isRefetching: query.isRefetching,
  };
}

export async function fetchLibraryCounts(
  fetcher: (params: TrackingListParams) => ReturnType<typeof getMyTracking> = getMyTracking,
): Promise<{ counts: Record<TrackingStatus, number>; total: number }> {
  const counts: Record<TrackingStatus, number> = {
    reading: 0,
    plan_to_read: 0,
    completed: 0,
    on_hold: 0,
    dropped: 0,
    re_reading: 0,
  };

  const firstPage = await fetcher({ limit: 100, page: 1 });
  const total = firstPage.pagination.total;

  for (const entry of firstPage.data) {
    const status = entry.status;
    if (status && TRACKING_STATUSES.includes(status as TrackingStatus)) {
      counts[status as TrackingStatus] += 1;
    }
  }

  if (firstPage.pagination.hasMore && total > 100) {
    let currentPage = 2;
    let hasMore = true;
    const maxPages = Math.min(firstPage.pagination.totalPages || Math.ceil(total / 100), 20);

    while (hasMore && currentPage <= maxPages) {
      const nextPage = await fetcher({ limit: 100, page: currentPage });
      for (const entry of nextPage.data) {
        const status = entry.status;
        if (status && TRACKING_STATUSES.includes(status as TrackingStatus)) {
          counts[status as TrackingStatus] += 1;
        }
      }
      hasMore = nextPage.pagination.hasMore;
      currentPage += 1;
    }
  }

  return { counts, total };
}

export function useLibraryCounts() {
  const query = useQuery({
    queryKey: queryKeys.tracking({ counts: true }),
    staleTime: STALE.tracking,
    queryFn: () => fetchLibraryCounts(),
  });

  return {
    counts: query.data?.counts ?? null,
    total: query.data?.total ?? 0,
    refetch: () => void query.refetch(),
  };
}
