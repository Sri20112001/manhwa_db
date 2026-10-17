import { useCallback } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getList, listPublicLists, type ListQueryParams } from '@/api/endpoints/lists';
import { STALE } from '@/shared/constants/query';
import { toListDetail, toListSummary } from '@/logic/mappers/list';
import { enqueueWriteItem } from '@/logic/usecases/queueTrackingWrite';

import { queryKeys } from '../query/keys';

export type ListFilter = 'trending' | 'new' | 'likes';

export function useLists(filter: ListFilter, search: string) {
  const params: ListQueryParams = {
    limit: 20,
    sort: filter,
    ...(search.trim() ? { search: search.trim() } : {}),
  };

  const query = useInfiniteQuery({
    queryKey: queryKeys.lists(params),
    staleTime: STALE.lists,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await listPublicLists({ ...params, page: pageParam });
      return { items: page.data.map(toListSummary), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    lists: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useListDetail(username: string, slug: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.list(username, slug),
    queryFn: async () => toListDetail((await getList(username, slug)).data),
    enabled: username.length > 0 && slug.length > 0,
    staleTime: STALE.list,
  });

  const like = useMutation({
    mutationFn: async (liked: boolean) => {
      enqueueWriteItem({ kind: 'list.like', username, slug, liked });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.list(username, slug) });
    },
  });

  const toggleLike = useCallback(
    (liked: boolean) => {
      like.mutate(liked);
    },
    [like],
  );

  return {
    list: query.data ?? null,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
    toggleLike,
    isLiking: like.isPending,
  };
}
