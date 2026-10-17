import { apiRequest } from '../client';
import type { Paginated } from '../envelope';
import type { PornhwaDTO, QueryParams } from './catalogue';

export function getTrending(params: QueryParams = {}) {
  return apiRequest<Paginated<PornhwaDTO>>({ url: '/discover/trending', params });
}

export function getTopRated(params: QueryParams = {}) {
  return apiRequest<Paginated<PornhwaDTO>>({ url: '/discover/top-rated', params });
}

export function getRecentlyUpdated(params: QueryParams = {}) {
  return apiRequest<Paginated<PornhwaDTO>>({ url: '/discover/recently-updated', params });
}

export function getNewReleases(params: QueryParams = {}) {
  return apiRequest<Paginated<PornhwaDTO>>({ url: '/discover/new', params });
}

export function getRandomPicks(params: QueryParams = {}) {
  return apiRequest<Paginated<PornhwaDTO>>({ url: '/discover/random', params });
}
