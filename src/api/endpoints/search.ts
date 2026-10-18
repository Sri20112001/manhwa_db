import { apiRequest } from '../client';
import type { Paginated, SearchEnvelope } from '../envelope';
import type { ChapterSearchChapterDto } from '../generated';
import type { QueryParams } from './catalogue';

export type ChapterSearchDTO = ChapterSearchChapterDto;

export interface GlobalSearchParams extends QueryParams {
  q: string;
  type?: 'pornhwa' | 'character' | 'all';
  page?: number;
  limit?: number;
}

export function searchGlobal(params: GlobalSearchParams) {
  return apiRequest<SearchEnvelope>({ url: '/search', params });
}

export function searchChapters(params: QueryParams) {
  return apiRequest<Paginated<ChapterSearchDTO>>({ url: '/chapters/search', params });
}

export interface ChapterTagParams extends QueryParams {
  tags?: string;
  tagMode?: 'any' | 'all';
  status?: string;
  search?: string;
}

export function getChapterTags() {
  return apiRequest<Paginated<string>>({ url: '/chapters/tags' });
}

export function getChaptersByTag(tag: string, params: QueryParams = {}) {
  return apiRequest<Paginated<ChapterSearchDTO>>({
    url: `/chapters/tag/${encodeURIComponent(tag)}`,
    params,
  });
}
