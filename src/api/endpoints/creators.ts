import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type { CreatorDto } from '../generated';
import type { QueryParams } from './catalogue';

export type CreatorDTO = CreatorDto;

export function listCreators(params: QueryParams = {}) {
  return apiRequest<Paginated<CreatorDTO>>({ url: '/creators', params });
}

export function getCreator(id: number) {
  return apiRequest<Single<CreatorDTO>>({ url: `/creators/${id}` });
}
