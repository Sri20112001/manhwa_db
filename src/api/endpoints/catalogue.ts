import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type { components } from '../schema';

export type PornhwaDTO = components['schemas']['Pornhwa'];
export type PornhwaDetailDTO = components['schemas']['PornhwaDetail'];
export type ChapterDTO = components['schemas']['Chapter'];
export type CharacterDTO = components['schemas']['Character'];
export type ReviewDTO = components['schemas']['Review'];
export type RatingAggregateDTO = components['schemas']['RatingAggregate'];

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface ListPornhwaParams extends QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  orientation?: 'yaoi' | 'yuri' | 'none';
  tags?: string;
  excludedTags?: string;
  tagMode?: 'any' | 'all';
  sort?:
    | 'title'
    | 'release_year'
    | 'created_at'
    | 'updated_at'
    | 'average_rating'
    | 'total_ratings'
    | 'chapter_count';
  order?: 'asc' | 'desc';
  minRating?: number;
  maxRating?: number;
  creator?: string;
}

export function listPornhwa(params: ListPornhwaParams = {}) {
  const { minRating, maxRating, ...rest } = params;
  return apiRequest<Paginated<PornhwaDTO>>({
    url: '/pornhwa',
    params: {
      ...rest,
      ...(minRating != null ? { 'averageRating[gte]': minRating } : {}),
      ...(maxRating != null ? { 'averageRating[lte]': maxRating } : {}),
    },
  });
}

export function getPornhwa(slug: string, params: QueryParams = {}) {
  return apiRequest<Single<PornhwaDetailDTO>>({ url: `/pornhwa/${slug}`, params });
}

export function getPornhwaBatch(ids: number[]) {
  return apiRequest<Paginated<PornhwaDTO>>({
    url: '/pornhwa/batch',
    params: { ids: ids.join(',') },
  });
}

export function getPornhwaChapters(slug: string, params: QueryParams = {}) {
  return apiRequest<Paginated<ChapterDTO>>({ url: `/pornhwa/${slug}/chapters`, params });
}

export function getPornhwaCharacters(slug: string, params: QueryParams = {}) {
  return apiRequest<Paginated<CharacterDTO>>({ url: `/pornhwa/${slug}/characters`, params });
}

export function getPornhwaRatings(slug: string) {
  return apiRequest<Single<RatingAggregateDTO>>({ url: `/pornhwa/${slug}/ratings` });
}

export function getPornhwaReviews(slug: string, params: QueryParams = {}) {
  return apiRequest<Paginated<ReviewDTO>>({ url: `/pornhwa/${slug}/reviews`, params });
}

export function getSimilarPornhwa(slug: string, params: QueryParams = {}) {
  return apiRequest<Paginated<PornhwaDTO>>({ url: `/pornhwa/${slug}/similar`, params });
}
