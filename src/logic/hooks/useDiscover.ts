import { useQuery } from '@tanstack/react-query';

import {
  getNewReleases,
  getRandomPicks,
  getRecentlyUpdated,
  getTopRated,
  getTrending,
} from '@/api/endpoints/discover';
import { STALE } from '@/shared/constants/query';
import { toSeries } from '@/logic/mappers/pornhwa';

import { queryKeys } from '../query/keys';

const LIMIT = 20;

export interface DiscoverSection {
  key: string;
  title: string;
  data: ReturnType<typeof toSeries>[];
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useDiscover() {
  const trending = useQuery({
    queryKey: queryKeys.discover('trending', { limit: LIMIT }),
    queryFn: async () => (await getTrending({ limit: LIMIT })).data.map(toSeries),
    staleTime: STALE.discover,
  });

  const topRated = useQuery({
    queryKey: queryKeys.discover('top-rated', { limit: LIMIT }),
    queryFn: async () => (await getTopRated({ limit: LIMIT })).data.map(toSeries),
    staleTime: STALE.discover,
  });

  const recent = useQuery({
    queryKey: queryKeys.discover('recently-updated', { limit: LIMIT }),
    queryFn: async () => (await getRecentlyUpdated({ limit: LIMIT })).data.map(toSeries),
    staleTime: STALE.discover,
  });

  const fresh = useQuery({
    queryKey: queryKeys.discover('new', { limit: LIMIT }),
    queryFn: async () => (await getNewReleases({ limit: LIMIT })).data.map(toSeries),
    staleTime: STALE.discover,
  });

  const random = useQuery({
    queryKey: queryKeys.discover('random', { count: 10 }),
    queryFn: async () => (await getRandomPicks({ count: 10 })).data.map(toSeries),
    staleTime: 0,
  });

  const sections: DiscoverSection[] = [
    {
      key: 'top-rated',
      title: 'Top rated',
      data: topRated.data ?? [],
      isPending: topRated.isPending,
      isError: topRated.isError,
      refetch: () => void topRated.refetch(),
    },
    {
      key: 'trending',
      title: 'Trending now',
      data: trending.data ?? [],
      isPending: trending.isPending,
      isError: trending.isError,
      refetch: () => void trending.refetch(),
    },
    {
      key: 'new',
      title: 'Fresh arrivals',
      data: fresh.data ?? [],
      isPending: fresh.isPending,
      isError: fresh.isError,
      refetch: () => void fresh.refetch(),
    },
    {
      key: 'recently-updated',
      title: 'Recently updated',
      data: recent.data ?? [],
      isPending: recent.isPending,
      isError: recent.isError,
      refetch: () => void recent.refetch(),
    },
  ];

  return {
    sections,
    random: random.data ?? [],
    isRandomPending: random.isPending,
    shuffleRandom: () => void random.refetch(),
    isPending: topRated.isPending && trending.isPending,
    isError: topRated.isError && trending.isError && recent.isError && fresh.isError,
    refetch: () => {
      void topRated.refetch();
      void trending.refetch();
      void fresh.refetch();
      void recent.refetch();
    },
  };
}
