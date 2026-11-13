import { useInfiniteQuery } from '@tanstack/react-query';

import { listGalleryPanels, type GallerySort } from '@/api/endpoints/gallery';
import { STALE } from '@/shared/constants/query';

import { queryKeys } from '../query/keys';

export interface GalleryFilters {
  pornhwaIds?: number[];
  characterIds?: number[];
}

export function useGallery(
  search: string,
  sort: GallerySort = 'newest',
  filters: GalleryFilters = {},
) {
  const params = {
    limit: 24,
    sort,
    search: search || undefined,
    pornhwaIds: filters.pornhwaIds,
    characterIds: filters.characterIds,
  };

  const query = useInfiniteQuery({
    queryKey: queryKeys.gallery(params),
    staleTime: STALE.gallery,
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => listGalleryPanels({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
  });

  const panels = query.data?.pages.flatMap((page) => page.panels) ?? [];
  const total = query.data?.pages[0]?.pagination.total ?? 0;

  return {
    panels,
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
