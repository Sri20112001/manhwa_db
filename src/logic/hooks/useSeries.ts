import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getPornhwa,
  getPornhwaCharacters,
  getPornhwaRatings,
  getPornhwaReviews,
  getSimilarPornhwa,
} from '@/api/endpoints/catalogue';
import { STALE } from '@/shared/constants/query';
import { toCharacter } from '@/logic/mappers/character';
import { toSeries, toSeriesDetail } from '@/logic/mappers/pornhwa';

import { queryKeys } from '../query/keys';

export function useSeries(slug: string) {
  const detail = useQuery({
    queryKey: queryKeys.series(slug),
    queryFn: async () => toSeriesDetail((await getPornhwa(slug)).data),
    enabled: slug.length > 0,
    staleTime: STALE.series,
  });

  const ratings = useQuery({
    queryKey: queryKeys.seriesRatings(slug),
    queryFn: async () => (await getPornhwaRatings(slug)).data,
    enabled: slug.length > 0,
    staleTime: STALE.ratings,
  });

  return {
    series: detail.data ?? null,
    isPending: detail.isPending,
    isError: detail.isError,
    error: detail.error,
    refetch: () => {
      void detail.refetch();
      void ratings.refetch();
    },
    ratings: ratings.data ?? null,
  };
}

export function useSeriesCharacters(slug: string, enabled: boolean) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.seriesCharacters(slug),
    enabled: enabled && slug.length > 0,
    staleTime: STALE.characters,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getPornhwaCharacters(slug, { page: pageParam, limit: 24 });
      const reference = {
        id: 0,
        title: '',
        slug,
        coverImage: null,
      };
      return {
        items: page.data.map((dto) => toCharacter(dto, reference)),
        pagination: page.pagination,
      };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useSeriesReviews(slug: string, enabled: boolean) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.seriesReviews(slug),
    enabled: enabled && slug.length > 0,
    staleTime: STALE.reviews,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getPornhwaReviews(slug, { page: pageParam, limit: 20 });
      return {
        items: page.data.map((dto) => ({
          id: dto.id ?? 0,
          reviewText: dto.reviewText ?? '',
          isEdited: dto.isEdited ?? false,
          userDisplayName: dto.userDisplayName ?? 'Anonymous',
          uid: null,
          userRating: dto.userRating ?? null,
          avatarImage: null,
          createdAt: dto.createdAt ?? '',
          updatedAt: dto.updatedAt ?? '',
        })),
        pagination: page.pagination,
      };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
  };
}

export function useSimilarSeries(slug: string, enabled: boolean) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.similar(slug),
    enabled: enabled && slug.length > 0,
    staleTime: STALE.catalogue,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getSimilarPornhwa(slug, { page: pageParam, limit: 12 });
      return { items: page.data.map(toSeries), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
  };
}
