import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type {
  ChapterDto,
  CharacterDto,
  PornhwaDetailDto,
  PornhwaDto,
  RatingAggregateDto,
  ReviewDto,
} from '../generated';

export type PornhwaDTO = PornhwaDto;
export type PornhwaDetailDTO = PornhwaDetailDto;
export type ChapterDTO = ChapterDto;
export type CharacterDTO = CharacterDto;
export type ReviewDTO = ReviewDto;
export type RatingAggregateDTO = RatingAggregateDto;

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

export function getPornhwaCharacters(slug: string, params?: QueryParams) {
  return apiRequest<{ data: CharacterDTO[]; pagination?: Paginated<CharacterDTO>['pagination']; requestId: string }>({
    url: `/pornhwa/${slug}/characters`,
    ...(params && Object.keys(params).length > 0 ? { params } : {}),
  });
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
