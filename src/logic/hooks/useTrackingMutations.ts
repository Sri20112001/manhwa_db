import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getFavorite, getTrackingEntry } from '@/api/endpoints/tracking';
import { STALE } from '@/shared/constants/query';
import { toTrackingEntry } from '@/logic/mappers/pornhwa';
import {
  enqueueFavorite,
  enqueueRating,
  enqueueTrackingAction,
  enqueueTrackingDelete,
  enqueueTrackingStatus,
} from '@/logic/usecases/queueTrackingWrite';
import type { TrackingStatus } from '@/shared/constants/status';

import { queryKeys } from '../query/keys';

export function useTrackingMutations() {
  const setStatus = useCallback(
    (identifier: string, status: TrackingStatus, currentChapter?: number | null) => {
      enqueueTrackingStatus(identifier, status, currentChapter);
    },
    [],
  );

  const remove = useCallback((identifier: string) => {
    enqueueTrackingDelete(identifier);
  }, []);

  const favorite = useCallback((identifier: string, value: boolean) => {
    enqueueFavorite(identifier, value);
  }, []);

  const rate = useCallback((identifier: string, rating: number) => {
    enqueueRating(identifier, rating);
  }, []);

  const incrementChapter = useCallback((identifier: string) => {
    enqueueTrackingAction(identifier, 'increment-chapter');
  }, []);

  const markCompleted = useCallback((identifier: string) => {
    enqueueTrackingAction(identifier, 'mark-completed');
  }, []);

  const startRereading = useCallback((identifier: string) => {
    enqueueTrackingAction(identifier, 'start-rereading');
  }, []);

  return { setStatus, remove, favorite, rate, incrementChapter, markCompleted, startRereading };
}

export function useFavorite(identifier: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['tracking', 'favorite', identifier],
    queryFn: async () => (await getFavorite(identifier)).data.favorited,
    enabled: identifier.length > 0,
    staleTime: STALE.tracking,
  });

  const setFavorited = useCallback(
    (favorited: boolean) => {
      queryClient.setQueryData(['tracking', 'favorite', identifier], favorited);
    },
    [identifier, queryClient],
  );

  return {
    isFavorited: query.data ?? false,
    isPending: query.isPending,
    setFavorited,
  };
}

export function useTrackingEntry(identifier: string) {
  const query = useQuery({
    queryKey: queryKeys.trackingEntry(identifier),
    queryFn: async () => toTrackingEntry((await getTrackingEntry(identifier)).data),
    enabled: identifier.length > 0,
    staleTime: STALE.tracking,
  });

  return {
    entry: query.data ?? null,
    isPending: query.isPending,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
