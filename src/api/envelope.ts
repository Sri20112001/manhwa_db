import type { Pagination } from '@/shared/types/models';

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
  requestId: string;
}

export interface Single<T> {
  data: T;
  requestId: string;
}

export interface SearchCharacterHit {
  id: number;
  name: string;
  image: string | null;
  pornhwaId: number;
  pornhwaTitle: string | null;
  pornhwaSlug: string | null;
}

export interface SearchPornhwaHit {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  status: string | null;
  orientation: string | null;
}

export interface SearchEnvelope {
  data: {
    pornhwa: SearchPornhwaHit[];
    characters: SearchCharacterHit[];
  };
  pagination: {
    pornhwa: Pagination | null;
    characters: Pagination | null;
  };
  requestId: string;
}

export function isPaginated<T>(value: unknown): value is Paginated<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'pagination' in value &&
    Array.isArray((value as { data: unknown }).data)
  );
}

export function isSingle<T>(value: unknown): value is Single<T> {
  return typeof value === 'object' && value !== null && 'data' in value;
}

export function isSearchEnvelope(value: unknown): value is SearchEnvelope {
  if (typeof value !== 'object' || value === null) return false;
  const data = (value as { data?: unknown }).data;
  return (
    typeof data === 'object' &&
    data !== null &&
    'pornhwa' in data &&
    'characters' in data
  );
}

export function emptyPage<T>(limit = 20): Paginated<T> {
  return {
    data: [],
    requestId: '',
    pagination: {
      page: 1,
      limit,
      total: 0,
      totalPages: 0,
      hasMore: false,
      nextUrl: null,
      prevUrl: null,
      firstUrl: '',
      lastUrl: '',
      truncated: false,
    },
  };
}
