import { useInfiniteQuery } from '@tanstack/react-query';

import { listPornhwa, type ListPornhwaParams } from '@/api/endpoints/catalogue';
import { STALE } from '@/shared/constants/query';
import { DEFAULT_FILTERS } from '@/shared/types/filters';
import type { BrowseFilters } from '@/shared/types/filters';
import { toSeries } from '@/logic/mappers/pornhwa';

import { queryKeys } from '../query/keys';

export function filtersToParams(filters: BrowseFilters): ListPornhwaParams {
  const params: ListPornhwaParams = {
    limit: 24,
    sort: filters.sort,
    order: filters.order,
  };

  if (filters.status.length > 0) params.status = filters.status.join(',');
  if (filters.orientation !== 'any') params.orientation = filters.orientation;
  if (filters.tags.length > 0) {
    params.tags = filters.tags.join(',');
    params.tagMode = filters.tagMode;
  }
  if (filters.rating.min > DEFAULT_FILTERS.rating.min) params.minRating = filters.rating.min;
  if (filters.rating.max < DEFAULT_FILTERS.rating.max) params.maxRating = filters.rating.max;
  return params;
}

export function useBrowse(filters: BrowseFilters, enabled = true) {
  const params = filtersToParams(filters);

  const query = useInfiniteQuery({
    queryKey: queryKeys.catalogue(params),
    enabled,
    staleTime: STALE.catalogue,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await listPornhwa({ ...params, page: pageParam });
      return {
        items: page.data.map(toSeries),
        pagination: page.pagination,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.pagination.total ?? 0;

  return {
    items,
    total,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
    fetchNextPage: () => void query.fetchNextPage(),
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    isRefetching: query.isRefetching,
  };
}
