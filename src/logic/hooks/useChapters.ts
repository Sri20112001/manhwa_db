import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getPornhwaChapters } from '@/api/endpoints/catalogue';
import { getChapter } from '@/api/endpoints/characters';
import { getChapterTags, getChaptersByTag } from '@/api/endpoints/search';
import { STALE } from '@/shared/constants/query';
import { toChapter } from '@/logic/mappers/chapter';

import { queryKeys } from '../query/keys';

export function useChapters(slug: string, pornhwaId = 0) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.seriesChapters(slug),
    enabled: slug.length > 0,
    staleTime: STALE.chapters,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getPornhwaChapters(slug, { page: pageParam, limit: 50 });
      return {
        items: page.data.map((dto) => toChapter(dto, pornhwaId)),
        pagination: page.pagination,
      };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    chapters: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: () => void query.refetch(),
  };
}

export function useChapter(id: number) {
  return useQuery({
    queryKey: queryKeys.chapter(id),
    queryFn: async () => toChapter((await getChapter(id)).data),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: STALE.chapters,
  });
}

export function useChapterTags() {
  return useQuery({
    queryKey: queryKeys.tagsByType('chapter'),
    queryFn: async () => (await getChapterTags()).data,
    staleTime: STALE.tags,
  });
}

export function useChaptersByTag(tag: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.chapterSearch({ tag }),
    enabled: enabled && tag.length > 0,
    staleTime: STALE.search,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getChaptersByTag(tag, { page: pageParam, limit: 20 });
      return {
        items: page.data.map((dto) => toChapter(dto, dto.pornhwaId)),
        pagination: page.pagination,
      };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    chapters: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
  };
}
