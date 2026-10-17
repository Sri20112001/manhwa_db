import { useInfiniteQuery } from '@tanstack/react-query';

import { STALE } from '@/shared/constants/query';

import { queryKeys } from '../query/keys';
import { resolveSearch, type ResolvedSearchPage } from '../usecases/resolveSearch';

export function useSearch(query: string, segment: 'series' | 'characters', enabled: boolean) {
  const trimmed = query.trim();

  const search = useInfiniteQuery<ResolvedSearchPage>({
    queryKey: queryKeys.search({ q: trimmed, type: segment }),
    enabled: enabled && trimmed.length > 0,
    staleTime: STALE.search,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => resolveSearch(trimmed, segment, pageParam as number),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const items = search.data?.pages.flatMap((page) => page.items) ?? [];
  const total = search.data?.pages[0]?.total ?? 0;

  return {
    items,
    total,
    isPending: search.isPending,
    isFetching: search.isFetching,
    isError: search.isError,
    error: search.error,
    hasNextPage: Boolean(search.hasNextPage),
    isFetchingNextPage: search.isFetchingNextPage,
    fetchNextPage: () => void search.fetchNextPage(),
    refetch: () => void search.refetch(),
  };
}
