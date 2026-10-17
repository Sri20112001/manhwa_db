import { useInfiniteQuery } from '@tanstack/react-query';

import { getActivityFeed, type ActivityParams } from '@/api/endpoints/activity';
import { STALE } from '@/shared/constants/query';
import { toActivityItem } from '@/logic/mappers/activity';

import { queryKeys } from '../query/keys';

export function useActivity(type?: string) {
  const params: ActivityParams = { limit: 25, ...(type ? { type } : {}) };

  const query = useInfiniteQuery({
    queryKey: queryKeys.activity(params),
    staleTime: STALE.activity,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getActivityFeed({ ...params, page: pageParam });
      return { items: page.data.map(toActivityItem), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
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
