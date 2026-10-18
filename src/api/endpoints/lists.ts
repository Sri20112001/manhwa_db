import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type { ListDetailDto, ListSummaryDto } from '../generated';
import type { QueryParams } from './catalogue';

export type ListSummaryDTO = ListSummaryDto;
export type ListDetailDTO = ListDetailDto;

export interface ListQueryParams extends QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'trending' | 'new' | 'likes';
}

export function listPublicLists(params: ListQueryParams = {}) {
  return apiRequest<Paginated<ListSummaryDTO>>({ url: '/lists', params });
}

export function getList(username: string, slug: string, params: QueryParams = {}) {
  return apiRequest<Single<ListDetailDTO>>({
    url: `/lists/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
    params,
  });
}

export interface ListWriteInput {
  title: string;
  description?: string;
  isPublic?: boolean;
  isCollaborative?: boolean;
  itemIds?: number[];
}

// The public API documents list reads only; these write routes follow the REST
// surface the app targets and surface a clear error when unavailable.
export function createList(input: ListWriteInput) {
  return apiRequest<Single<ListDetailDTO>>({ url: '/lists', method: 'POST', data: input });
}

export function updateList(username: string, slug: string, input: Partial<ListWriteInput>) {
  return apiRequest<Single<ListDetailDTO>>({
    url: `/lists/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
    method: 'PATCH',
    data: input,
  });
}

export function deleteList(username: string, slug: string) {
  return apiRequest<void>({
    url: `/lists/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
    method: 'DELETE',
  });
}

export function likeList(username: string, slug: string) {
  return apiRequest<Single<{ likeCount: number }>>({
    url: `/lists/${encodeURIComponent(username)}/${encodeURIComponent(slug)}/like`,
    method: 'POST',
    data: {},
  });
}

export function unlikeList(username: string, slug: string) {
  return apiRequest<Single<{ likeCount: number }>>({
    url: `/lists/${encodeURIComponent(username)}/${encodeURIComponent(slug)}/like`,
    method: 'DELETE',
  });
}
