import type { Paginated } from '@/api/envelope';
import type { TrackingUpsertDTO } from '@/api/endpoints/tracking';
import type { TrackingStatus } from '@/shared/constants/status';
import type { TrackingEntry } from '@/shared/types/models';

import { queryClient } from '../query/client';
import { enqueueWrite, type QueuedWrite } from '../query/mutations.queue';

type TrackingPage = Paginated<TrackingEntry>;

function isTrackingPage(value: unknown): value is TrackingPage {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  );
}

function matchesIdentifier(entry: TrackingEntry, identifier: string): boolean {
  return String(entry.series.id) === identifier || String(entry.id) === identifier;
}

function patchTrackingCaches(
  identifier: string,
  updater: (entry: TrackingEntry) => TrackingEntry,
): void {
  const queries = queryClient.getQueryCache().findAll({ queryKey: ['tracking'] });
  for (const query of queries) {
    const snapshot = query.state.data;
    if (isTrackingPage(snapshot)) {
      queryClient.setQueryData<TrackingPage>(query.queryKey, {
        ...snapshot,
        data: snapshot.data.map((entry) =>
          matchesIdentifier(entry, identifier) ? updater(entry) : entry,
        ),
      });
      continue;
    }
    if (Array.isArray(snapshot)) {
      queryClient.setQueryData(
        query.queryKey,
        (snapshot as TrackingEntry[]).map((entry) =>
          matchesIdentifier(entry, identifier) ? updater(entry) : entry,
        ),
      );
    }
  }
}

export interface TrackingWriteOptions {
  optimistic?: boolean;
}

export function enqueueTrackingStatus(
  identifier: string,
  status: TrackingStatus,
  currentChapter?: number | null,
): void {
  if (currentChapter !== undefined) {
    patchTrackingCaches(identifier, (entry) => ({ ...entry, status, currentChapter }));
  } else {
    patchTrackingCaches(identifier, (entry) => ({ ...entry, status }));
  }
  const body: TrackingUpsertDTO = {
    status,
    currentChapter,
    timesCompleted: 0,
    isPrivate: false,
  };
  enqueueWrite({ kind: 'tracking.upsert', identifier, body });
}

export function enqueueTrackingDelete(identifier: string): void {
  const queries = queryClient.getQueryCache().findAll({ queryKey: ['tracking'] });
  for (const query of queries) {
    const snapshot = query.state.data;
    if (isTrackingPage(snapshot)) {
      queryClient.setQueryData<TrackingPage>(query.queryKey, {
        ...snapshot,
        data: snapshot.data.filter((entry) => !matchesIdentifier(entry, identifier)),
      });
    }
  }
  enqueueWrite({ kind: 'tracking.delete', identifier });
}

export function enqueueFavorite(identifier: string, favorite: boolean): void {
  enqueueWrite({ kind: 'tracking.favorite', identifier, favorite });
}

export function enqueueRating(identifier: string, rating: number): void {
  enqueueWrite({ kind: 'tracking.rating', identifier, rating });
}

export function enqueueTrackingAction(
  identifier: string,
  action: 'mark-completed' | 'start-rereading' | 'increment-chapter',
): void {
  if (action === 'increment-chapter') {
    patchTrackingCaches(identifier, (entry) => ({
      ...entry,
      currentChapter: (entry.currentChapter ?? 0) + 1,
    }));
  }
  if (action === 'mark-completed') {
    patchTrackingCaches(identifier, (entry) => ({ ...entry, status: 'completed' }));
  }
  if (action === 'start-rereading') {
    patchTrackingCaches(identifier, (entry) => ({ ...entry, status: 're_reading' }));
  }
  enqueueWrite({ kind: 'tracking.action', identifier, action });
}

export function enqueueWriteItem(write: QueuedWrite): void {
  enqueueWrite(write);
}
