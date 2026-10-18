import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type { TrackingEntryDto, TrackingStatusDto, TrackingUpsertInputDto } from '../generated';
import type { QueryParams } from './catalogue';

export type TrackingEntryDTO = TrackingEntryDto;
export type TrackingUpsertDTO = TrackingUpsertInputDto;
export type TrackingStatusValue = TrackingStatusDto;

export interface TrackingListParams extends QueryParams {
  page?: number;
  limit?: number;
  status?: string;
  ids?: string;
  sort?: 'updated_at' | 'created_at' | 'title' | 'rating' | 'chapters' | 'progress' | 'priority';
  order?: 'asc' | 'desc';
}

export function getMyTracking(params: TrackingListParams = {}) {
  return apiRequest<Paginated<TrackingEntryDTO>>({ url: '/me/tracking', params });
}

export function getTrackingEntry(identifier: string | number) {
  return apiRequest<Single<TrackingEntryDTO>>({ url: `/me/tracking/${identifier}` });
}

export function upsertTracking(identifier: string | number, body: TrackingUpsertDTO) {
  return apiRequest<Single<TrackingEntryDTO>>({
    url: `/me/tracking/${identifier}`,
    method: 'PUT',
    data: body,
  });
}

export function deleteTracking(identifier: string | number) {
  return apiRequest<void>({ url: `/me/tracking/${identifier}`, method: 'DELETE' });
}

export function rateSeries(identifier: string | number, rating: number) {
  return apiRequest<Single<{ rating: number }>>({
    url: `/me/tracking/${identifier}/rating`,
    method: 'PATCH',
    data: { rating },
  });
}

export function deleteRating(identifier: string | number) {
  return apiRequest<void>({ url: `/me/tracking/${identifier}/rating`, method: 'DELETE' });
}

export function addFavorite(identifier: string | number) {
  return apiRequest<Single<{ isFavorite: boolean }>>({
    url: `/me/tracking/${identifier}/favorite`,
    method: 'PUT',
    data: {},
  });
}

export function removeFavorite(identifier: string | number) {
  return apiRequest<void>({ url: `/me/tracking/${identifier}/favorite`, method: 'DELETE' });
}

export function markCompleted(identifier: string | number) {
  return apiRequest<Single<TrackingEntryDTO>>({
    url: `/me/tracking/${identifier}/actions/mark-completed`,
    method: 'POST',
    data: {},
  });
}

export function startRereading(identifier: string | number) {
  return apiRequest<Single<TrackingEntryDTO>>({
    url: `/me/tracking/${identifier}/actions/start-rereading`,
    method: 'POST',
    data: {},
  });
}

export function incrementChapter(identifier: string | number) {
  return apiRequest<Single<TrackingEntryDTO>>({
    url: `/me/tracking/${identifier}/actions/increment-chapter`,
    method: 'POST',
    data: {},
  });
}
