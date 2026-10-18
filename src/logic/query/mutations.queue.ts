import {
  addFavorite,
  deleteRating,
  deleteTracking,
  incrementChapter,
  markCompleted,
  rateSeries,
  removeFavorite,
  startRereading,
  upsertTracking,
  type TrackingUpsertDTO,
} from '@/api/endpoints/tracking';
import {
  createList,
  deleteList,
  likeList,
  unlikeList,
  updateList,
  type ListWriteInput,
} from '@/api/endpoints/lists';
import {
  createRating,
  createReview,
  deleteReview,
  removeRating,
  updateReview,
  type UpdateReviewInput,
  type WriteReviewInput,
} from '@/api/endpoints/reviews';
import { ApiError, AuthError, RateLimitError } from '@/api/errors';
import { RETRY } from '@/shared/constants/caps';
import { STORAGE_KEYS, readJson, writeJson } from '@/shared/lib/storage';

import { queryClient } from './client';
import { useRootStore } from '@/logic/store';

export type TrackingAction = 'mark-completed' | 'start-rereading' | 'increment-chapter';

export type QueuedWrite =
  | { kind: 'tracking.upsert'; identifier: string; body: TrackingUpsertDTO }
  | { kind: 'tracking.delete'; identifier: string }
  | { kind: 'tracking.rating'; identifier: string; rating: number }
  | { kind: 'tracking.rating.delete'; identifier: string }
  | { kind: 'tracking.favorite'; identifier: string; favorite: boolean }
  | { kind: 'tracking.action'; identifier: string; action: TrackingAction }
  | { kind: 'list.create'; input: ListWriteInput }
  | { kind: 'list.update'; username: string; slug: string; input: Partial<ListWriteInput> }
  | { kind: 'list.delete'; username: string; slug: string }
  | { kind: 'list.like'; username: string; slug: string; liked: boolean }
  | { kind: 'review.create'; input: WriteReviewInput }
  | { kind: 'review.update'; input: UpdateReviewInput }
  | { kind: 'review.delete'; input: { id: number } }
  | { kind: 'rating.create'; input: { pornhwaId: number; rating: number } }
  | { kind: 'rating.delete'; input: { pornhwaId: number } };

export interface QueueItem {
  id: string;
  accountId: string;
  write: QueuedWrite;
  attempts: number;
  enqueuedAt: number;
  nextAttemptAt: number;
}

type Listener = (items: QueueItem[]) => void;

const MAX_QUEUE_ITEMS = 250;
const LEGACY_UNASSIGNED = 'legacy-unassigned';
const LEGACY_ITEM_TTL_MS = 7 * 24 * 60 * 60 * 1_000;

const items: QueueItem[] = [];
const listeners = new Set<Listener>();

let counter = 0;
let flushing = false;
let hydrated = false;
let timer: ReturnType<typeof setTimeout> | null = null;

function notify(): void {
  const snapshot = [...items];
  listeners.forEach((listener) => listener(snapshot));
  void writeJson(STORAGE_KEYS.writeQueue, snapshot);
  scheduleFlush();
}

export function subscribeQueue(listener: Listener): () => void {
  listeners.add(listener);
  listener([...items]);
  return () => listeners.delete(listener);
}

export function queueSnapshot(): QueueItem[] {
  return [...items];
}

export function pendingWriteCount(): number {
  return items.length;
}

export function clearAccountQueue(accountId?: string): void {
  if (!accountId) {
    items.length = 0;
  } else {
    const remaining = items.filter((item) => item.accountId !== accountId);
    items.splice(0, items.length, ...remaining);
  }
  notify();
}

function scheduleFlush(delayMs = 250): void {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    void flushQueue();
  }, delayMs);
}

export async function hydrateQueue(): Promise<void> {
  if (hydrated) return;
  hydrated = true;
  const stored = await readJson<QueueItem[]>(STORAGE_KEYS.writeQueue);
  if (stored && Array.isArray(stored)) {
    const now = Date.now();
    const migrated: QueueItem[] = [];
    for (const item of stored) {
      if (item && typeof item === 'object' && item.write) {
        if (!item.accountId) {
          migrated.push({ ...item, accountId: LEGACY_UNASSIGNED });
        } else {
          migrated.push(item);
        }
      }
    }
    const bounded = migrated.filter(
      (item) => item.accountId !== LEGACY_UNASSIGNED || now - item.enqueuedAt < LEGACY_ITEM_TTL_MS,
    );
    items.splice(0, items.length, ...bounded.slice(-MAX_QUEUE_ITEMS));
    listeners.forEach((listener) => listener([...items]));
  }
  scheduleFlush(1_000);
}

export function enqueueWrite(write: QueuedWrite, accountId?: string): string {
  const currentUid = accountId ?? useRootStore.getState().uid ?? 'anonymous';
  counter += 1;
  const id = `w${Date.now()}-${counter}`;
  if (items.length >= MAX_QUEUE_ITEMS) {
    items.shift();
  }
  items.push({
    id,
    accountId: currentUid,
    write,
    attempts: 0,
    enqueuedAt: Date.now(),
    nextAttemptAt: Date.now(),
  });
  notify();
  return id;
}

async function execute(write: QueuedWrite): Promise<void> {
  switch (write.kind) {
    case 'tracking.upsert':
      await upsertTracking(write.identifier, write.body);
      return;
    case 'tracking.delete':
      await deleteTracking(write.identifier);
      return;
    case 'tracking.rating':
      await rateSeries(write.identifier, write.rating);
      return;
    case 'tracking.rating.delete':
      await deleteRating(write.identifier);
      return;
    case 'tracking.favorite':
      if (write.favorite) await addFavorite(write.identifier);
      else await removeFavorite(write.identifier);
      return;
    case 'tracking.action':
      if (write.action === 'mark-completed') await markCompleted(write.identifier);
      else if (write.action === 'start-rereading') await startRereading(write.identifier);
      else await incrementChapter(write.identifier);
      return;
    case 'list.create':
      await createList(write.input);
      return;
    case 'list.update':
      await updateList(write.username, write.slug, write.input);
      return;
    case 'list.delete':
      await deleteList(write.username, write.slug);
      return;
    case 'list.like':
      if (write.liked) await likeList(write.username, write.slug);
      else await unlikeList(write.username, write.slug);
      return;
    case 'review.create':
      await createReview(write.input);
      return;
    case 'review.update':
      await updateReview(write.input);
      return;
    case 'review.delete':
      await deleteReview(write.input);
      return;
    case 'rating.create':
      await createRating(write.input);
      return;
    case 'rating.delete':
      await removeRating(write.input);
      return;
  }
}

function backoffMs(attempts: number): number {
  return Math.min(RETRY.baseBackoffMs * 2 ** attempts, RETRY.maxBackoffMs);
}

export async function flushQueue(): Promise<void> {
  if (flushing || items.length === 0) return;
  const storeState = useRootStore.getState();
  const currentUid = storeState.uid;
  const hasKey = storeState.hasKey;

  if (!hasKey || !currentUid) return;

  flushing = true;
  try {
    let index = 0;
    while (index < items.length) {
      const head = items[index];
      if (!head) break;

      if (head.accountId !== currentUid) {
        index += 1;
        continue;
      }

      if (head.nextAttemptAt > Date.now()) {
        scheduleFlush(Math.max(500, head.nextAttemptAt - Date.now()));
        index += 1;
        break;
      }
      try {
        await execute(head.write);
        items.splice(index, 1);
        useRootStore.getState().pushToast('Synced pending change', 'success');
        void queryClient.invalidateQueries({ queryKey: ['tracking'] });
        void queryClient.invalidateQueries({ queryKey: ['me'] });
        notify();
      } catch (error) {
        if (error instanceof RateLimitError) {
          head.nextAttemptAt = Date.now() + error.retryAfterSeconds * 1_000;
          notify();
          break;
        }
        if (error instanceof AuthError) {
          notify();
          break;
        }
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 429
        ) {
          items.splice(index, 1);
          useRootStore.getState().pushToast(error.message, 'error');
          notify();
          continue;
        }
        head.attempts += 1;
        if (head.attempts >= RETRY.queueMaxAttempts) {
          items.splice(index, 1);
          useRootStore.getState().pushToast('A queued change could not be synced.', 'error');
        } else {
          head.nextAttemptAt = Date.now() + backoffMs(head.attempts);
        }
        notify();
        break;
      }
    }
  } finally {
    flushing = false;
  }
}
