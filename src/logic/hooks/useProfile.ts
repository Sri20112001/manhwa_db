import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getMe,
  getMyFavorites,
  getMyRatings,
  getPublicProfile,
  getUserContributions,
  getUserLists,
  getUserRatings,
  getUserReviews,
  getUserTracking,
} from '@/api/endpoints/users';
import { STALE } from '@/shared/constants/query';
import { toListSummary } from '@/logic/mappers/list';
import { toProfile, toUserContribution, toUserRating, toUserReview } from '@/logic/mappers/profile';
import { toSeriesFromHit, toTrackingStatus } from '@/logic/mappers/pornhwa';
import type { TrackingStatus } from '@/shared/constants/status';

import { queryKeys } from '../query/keys';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => (await getMe()).data,
    staleTime: STALE.profile,
  });
}

export function useMyRatings() {
  const query = useInfiniteQuery({
    queryKey: queryKeys.myRatings({}),
    staleTime: STALE.ratings,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getMyRatings({ page: pageParam, limit: 24 });
      return { items: page.data.map(toUserRating), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    ratings: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
  };
}

export function useMyFavorites() {
  const query = useInfiniteQuery({
    queryKey: queryKeys.myFavorites({}),
    staleTime: STALE.tracking,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getMyFavorites({ page: pageParam, limit: 24 });
      return {
        items: page.data
          .filter((favorite) => favorite.type === 'pornhwa')
          .map((favorite) => ({ id: favorite.resourceId, createdAt: favorite.createdAt })),
        pagination: page.pagination,
      };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    favorites: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
  };
}

export function usePublicProfile(uid: string) {
  const query = useQuery({
    queryKey: queryKeys.profile(uid),
    queryFn: async () => {
      const result = (await getPublicProfile(uid)).data;
      return { profile: toProfile(result.profile), stats: result.stats };
    },
    enabled: uid.length > 0,
    staleTime: STALE.profile,
  });

  return {
    profile: query.data?.profile ?? null,
    stats: query.data?.stats ?? null,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}

export function useUserTracking(uid: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.userTracking(uid),
    enabled: enabled && uid.length > 0,
    staleTime: STALE.profile,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getUserTracking(uid, { page: pageParam, limit: 40 });
      return {
        items: page.data.map((entry) => ({
          series: toSeriesFromHit({
            id: entry.pornhwaId,
            title: entry.title,
            slug: entry.slug,
            coverImage: entry.coverImage,
            status: entry.pornhwaStatus,
          }),
          status: toTrackingStatus(entry.trackingStatus) as TrackingStatus,
          currentChapter: entry.currentChapter ?? null,
          totalChapters: entry.totalChapters ?? null,
        })),
        pagination: page.pagination,
      };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    entries: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
  };
}

export function useUserReviews(uid: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.userReviews(uid),
    enabled: enabled && uid.length > 0,
    staleTime: STALE.profile,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getUserReviews(uid, { page: pageParam, limit: 20 });
      return { items: page.data.map(toUserReview), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    reviews: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
  };
}

export function useUserRatings(uid: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.userRatings(uid),
    enabled: enabled && uid.length > 0,
    staleTime: STALE.profile,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getUserRatings(uid, { page: pageParam, limit: 24 });
      return { items: page.data.map(toUserRating), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    ratings: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
  };
}

export function useUserLists(uid: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.userLists(uid),
    enabled: enabled && uid.length > 0,
    staleTime: STALE.profile,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getUserLists(uid, { page: pageParam, limit: 20 });
      return { items: page.data.map(toListSummary), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    lists: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
  };
}

export function useUserContributions(uid: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.userContributions(uid),
    enabled: enabled && uid.length > 0,
    staleTime: STALE.profile,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getUserContributions(uid, { page: pageParam, limit: 20 });
      return { items: page.data.map(toUserContribution), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    contributions: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    hasNextPage: Boolean(query.hasNextPage),
    fetchNextPage: () => void query.fetchNextPage(),
  };
}
