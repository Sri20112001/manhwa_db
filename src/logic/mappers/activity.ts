import type { ActivityFeedItemDTO } from '@/api/endpoints/activity';
import type { ActivityEventType, ActivityItem, ActivityTarget } from '@/shared/types/models';
import type { TrackingStatus } from '@/shared/constants/status';

import { toTrackingStatus } from './pornhwa';

const EVENT_TYPES: ActivityEventType[] = [
  'review_posted',
  'rating_set',
  'character_rating_set',
  'tracking_status_changed',
  'list_created',
  'list_item_added',
];

function toEventType(value: string | undefined): ActivityEventType {
  const found = EVENT_TYPES.find((candidate) => candidate === value);
  return found ?? 'list_created';
}

function toTarget(raw: unknown): ActivityTarget {
  const target = (raw ?? {}) as Record<string, unknown>;
  const kind = target['kind'];
  if (kind === 'character') {
    return {
      kind: 'character',
      id: Number(target['id'] ?? 0),
      name: String(target['name'] ?? 'Unknown'),
      image: (target['image'] as string | null) ?? null,
    };
  }
  if (kind === 'list') {
    return {
      kind: 'list',
      id: Number(target['id'] ?? 0),
      title: String(target['title'] ?? 'Untitled list'),
      slug: String(target['slug'] ?? ''),
      username: String(target['username'] ?? ''),
    };
  }
  return {
    kind: 'pornhwa',
    id: Number(target['id'] ?? 0),
    title: String(target['title'] ?? 'Untitled'),
    slug: String(target['slug'] ?? ''),
    coverImage: (target['coverImage'] as string | null) ?? null,
  };
}

export function toActivityItem(dto: ActivityFeedItemDTO): ActivityItem {
  const metadata = (dto.metadata ?? {}) as Record<string, unknown>;
  const rating = metadata['rating'];
  const reviewText = metadata['reviewText'];
  const trackingStatus = metadata['trackingStatus'];
  return {
    id: String(dto.id ?? ''),
    eventType: toEventType(dto.eventType),
    occurredAt: String(dto.occurredAt ?? ''),
    actor: {
      uid: dto.actor?.uid ?? '',
      username: dto.actor?.username ?? 'Someone',
      avatarImage: dto.actor?.avatarImage ?? null,
    },
    target: toTarget(dto.target),
    rating: typeof rating === 'number' ? rating : null,
    reviewText: typeof reviewText === 'string' ? reviewText : null,
    trackingStatus:
      typeof trackingStatus === 'string' ? (toTrackingStatus(trackingStatus) as TrackingStatus) : null,
  };
}
