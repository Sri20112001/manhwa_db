import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getLeaderboard, getStats, type LeaderboardParams } from '@/api/endpoints/stats';
import { STALE } from '@/shared/constants/query';
import { toCatalogueStats, toLeaderboardRow } from '@/logic/mappers/stats';

import { queryKeys } from '../query/keys';

export type StatsPeriod = 'week' | 'month' | 'year' | 'all';

export function useStats(period: StatsPeriod) {
  const stats = useQuery({
    queryKey: queryKeys.stats,
    queryFn: async () => toCatalogueStats((await getStats()).data),
    staleTime: STALE.stats,
  });

  const params: LeaderboardParams = { period, limit: 25, sort: 'contributions' };

  const leaderboard = useInfiniteQuery({
    queryKey: queryKeys.leaderboard(params),
    staleTime: STALE.stats,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = await getLeaderboard({ ...params, page: pageParam });
      return { items: page.data.map(toLeaderboardRow), pagination: page.pagination };
    },
    getNextPageParam: (last) => (last.pagination.hasMore ? last.pagination.page + 1 : undefined),
  });

  return {
    stats: stats.data ?? null,
    isStatsPending: stats.isPending,
    isStatsError: stats.isError,
    leaderboard: leaderboard.data?.pages.flatMap((page) => page.items) ?? [],
    isLeaderboardPending: leaderboard.isPending,
    isLeaderboardError: leaderboard.isError,
    refetch: () => {
      void stats.refetch();
      void leaderboard.refetch();
    },
    hasNextPage: Boolean(leaderboard.hasNextPage),
    fetchNextPage: () => void leaderboard.fetchNextPage(),
  };
}
