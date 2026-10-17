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

export function useLibraryCounts() {
  const query = useQuery({
    queryKey: queryKeys.tracking({ counts: true }),
    staleTime: STALE.tracking,
    queryFn: async () => {
      const page = await getMyTracking({ limit: 100, page: 1 });
      const counts: Record<TrackingStatus, number> = {
        reading: 0,
        plan_to_read: 0,
        completed: 0,
        on_hold: 0,
        dropped: 0,
        re_reading: 0,
      };
      for (const entry of page.data) {
        const status = entry.status;
        if (status && TRACKING_STATUSES.includes(status)) counts[status] += 1;
      }
      return { counts, total: page.pagination.total };
    },
  });

  return {
    counts: query.data?.counts ?? null,
    total: query.data?.total ?? 0,
    refetch: () => void query.refetch(),
  };
}
