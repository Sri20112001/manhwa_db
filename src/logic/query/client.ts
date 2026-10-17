import { QueryClient } from '@tanstack/react-query';

import { STALE } from '@/shared/constants/query';
import { ApiError } from '@/api/errors';

function retryDelay(attempt: number): number {
  return Math.min(1_000 * 2 ** attempt, 30_000);
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE.catalogue,
        gcTime: STALE.series,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return false;
          if (error instanceof ApiError && error.status === 404) return false;
          return failureCount < 2;
        },
        retryDelay,
        refetchOnWindowFocus: false,
        networkMode: 'offlineFirst',
      },
      mutations: {
        retry: 0,
        networkMode: 'offlineFirst',
      },
    },
  });
}

export const queryClient = createQueryClient();
