import { useInfiniteQuery } from '@tanstack/react-query';

import { listCharacters } from '@/api/endpoints/characters';
import { toCharacter } from '@/logic/mappers/character';
import { STALE } from '@/shared/constants/query';

import { queryKeys } from '../query/keys';

export type CharacterSort = 'name' | 'role';
export type CharacterOrder = 'asc' | 'desc';

export interface CharacterBrowseOptions {
  sort?: CharacterSort;
  order?: CharacterOrder;
  limit?: number;
}

export function useBrowseCharacters(enabled = true, options: CharacterBrowseOptions = {}) {
  const params = {
    limit: options.limit ?? 24,
    sort: options.sort ?? 'name',
    order: options.order ?? 'asc',
  };

  const query = useInfiniteQuery({
    queryKey: queryKeys.characters(params),
    enabled,
    staleTime: STALE.characters,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await listCharacters({ ...params, page: pageParam });
      return {
        items: page.data.map((dto) => toCharacter(dto)),
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
