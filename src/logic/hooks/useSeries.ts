import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getPornhwa,
  getPornhwaCharacters,
  getPornhwaRatings,
  getPornhwaReviews,
  getSimilarPornhwa,
} from '@/api/endpoints/catalogue';
import { listCharacters } from '@/api/endpoints/characters';
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
  const query = useQuery({
    queryKey: queryKeys.seriesCharacters(slug),
    enabled: enabled && slug.length > 0,
    staleTime: STALE.characters,
    queryFn: async () => {
      const reference = {
        id: 0,
        title: '',
        slug,
        coverImage: null,
      };

      try {
        const res = await getPornhwaCharacters(slug);
        const list = Array.isArray(res?.data) ? res.data : [];
        if (list.length > 0) {
          return list.map((dto) => toCharacter(dto, reference));
        }
      } catch {
        // Fall back below
      }

      try {
        const res = await listCharacters({ pornhwaSlug: slug });
        const list = Array.isArray(res?.data) ? res.data : [];
        return list.map((dto) => toCharacter(dto, reference));
      } catch {
        return [];
      }
    },
  });

  return {
    items: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: false,
    fetchNextPage: () => {},
    isFetchingNextPage: false,
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
