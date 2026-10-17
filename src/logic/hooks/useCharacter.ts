import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getCharacter, getCharacterRatings, getCharacterReviews } from '@/api/endpoints/characters';
import { STALE } from '@/shared/constants/query';
import { toCharacter } from '@/logic/mappers/character';

import { queryKeys } from '../query/keys';

export function useCharacter(id: number) {
  const character = useQuery({
    queryKey: queryKeys.character(id),
    queryFn: async () => toCharacter((await getCharacter(id)).data),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: STALE.characters,
  });

  const ratings = useQuery({
    queryKey: queryKeys.characterRatings(id),
    queryFn: async () => (await getCharacterRatings(id, { limit: 50 })).data,
    enabled: Number.isFinite(id) && id > 0,
    staleTime: STALE.ratings,
  });

  const reviews = useInfiniteQuery({
    queryKey: queryKeys.characterReviews(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: STALE.reviews,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getCharacterReviews(id, { page: pageParam, limit: 20 });
      return {
        items: page.data.map((dto) => ({
          id: dto.id ?? 0,
          text: dto.reviewText ?? '',
          rating: dto.userRating ?? null,
          username: dto.userDisplayName ?? 'Anonymous',
          avatarImage: dto.avatarImage ?? null,
          createdAt: dto.createdAt ?? '',
        })),
        pagination: page.pagination,
      };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  const averageRating =
    ratings.data && ratings.data.length > 0
      ? ratings.data.reduce((sum, entry) => sum + (entry.rating ?? 0), 0) / ratings.data.length
      : null;

  return {
    character: character.data ?? null,
    isPending: character.isPending,
    isError: character.isError,
    error: character.error,
    refetch: () => {
      void character.refetch();
      void ratings.refetch();
    },
    averageRating,
    ratingCount: ratings.data?.length ?? 0,
    reviews: reviews.data?.pages.flatMap((page) => page.items) ?? [],
    reviewsPending: reviews.isPending,
  };
}
