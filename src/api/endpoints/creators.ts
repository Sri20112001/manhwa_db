import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type { components } from '../schema';
import type { QueryParams } from './catalogue';

export type CreatorDTO = components['schemas']['Creator'];

export function listCreators(params: QueryParams = {}) {
  return apiRequest<Paginated<CreatorDTO>>({ url: '/creators', params });
}

export function getCreator(id: number) {
  return apiRequest<Single<CreatorDTO>>({ url: `/creators/${id}` });
}
