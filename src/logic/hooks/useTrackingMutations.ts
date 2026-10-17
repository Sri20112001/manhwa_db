import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getTrackingEntry } from '@/api/endpoints/tracking';
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
