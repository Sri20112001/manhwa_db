import { Platform } from 'react-native';

import { SITE_BASE_URL } from '@/shared/constants/config';

import { throttleRequest } from '../throttle';

/**
 * The Gallery is served by the website's internal JSON endpoint, which is not
 * part of the versioned API v1 contract. It is public and read-only; likes and
 * uploads require a website session (Firebase bearer token) and are not used here.
 *
 * Note: the endpoint does not send CORS headers, so this works on native builds
 * but not in a browser (Expo web).
 */

export type GallerySort = 'newest' | 'oldest' | 'popular_all';

export interface GalleryPanelTag {
  id: number;
  name: string;
}

export interface GalleryPanel {
  id: number;
  user_id: string;
  uploader_username: string | null;
  image_path: string;
  title: string | null;
  pornhwa_title: string | null;
  pornhwa_id: number | null;
  pornhwa_slug: string | null;
  exact_chapter: number | null;
  chapter_sort: number | null;
  panel_type: string;
  /** Width divided by height, as a string (e.g. "0.686"). */
  aspect_ratio: string;
  uploaded_at: string;
  total_likes: number;
  chapter_start: number | null;
  chapter_end: number | null;
  gallery_chapter_number: number | null;
  panel_tags: GalleryPanelTag[];
  user_has_liked: boolean;
}

export interface GalleryPagination {
  limit: number;
  hasMore: boolean;
  sort: string;
  total: number;
  nextCursor: string | null;
  offset?: number;
  randomSeed?: number;
  filters?: Record<string, unknown>;
}

export interface GalleryResponse {
  success: boolean;
  panels: GalleryPanel[];
  pagination: GalleryPagination;
  message?: string;
}

export interface GalleryQuery {
  limit?: number;
  sort?: GallerySort;
  cursor?: string | null;
  search?: string;
  pornhwaIds?: number[];
  characterIds?: number[];
  tagIds?: number[];
  orientation?: 'yaoi' | 'yuri';
}

export function buildGalleryParams(query: GalleryQuery = {}): Record<string, string | number> {
  const params: Record<string, string | number> = {
    limit: query.limit ?? 24,
    sort: query.sort ?? 'newest',
  };

  if (query.cursor) params.cursor = query.cursor;

  const search = query.search?.trim();
  if (search) params.search = search;

  if (query.pornhwaIds && query.pornhwaIds.length > 0) {
    params.pornhwaIds = query.pornhwaIds.join(',');
  }
  if (query.characterIds && query.characterIds.length > 0) {
    params.characterIds = query.characterIds.join(',');
  }
  if (query.tagIds && query.tagIds.length > 0) {
    params.tagIds = query.tagIds.join(',');
  }
  if (query.orientation) params.orientation = query.orientation;

  return params;
}

export async function listGalleryPanels(query: GalleryQuery = {}): Promise<GalleryResponse> {
  await throttleRequest('get');

  const params = buildGalleryParams(query);
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const url = `${SITE_BASE_URL}/api/gallery?${searchParams.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (error) {
    if (Platform.OS === 'web') {
      throw new Error(
        'The Gallery cannot be loaded in a web browser due to CORS restrictions on pornhwadb.com. Please open the app in Expo Go on Android or iOS.',
        { cause: error },
      );
    }
    throw new Error('Could not load the gallery. Check your connection and try again.', {
      cause: error,
    });
  }

  if (res.status === 404) {
    throw new Error('The gallery is unavailable right now.');
  }

  if (!res.ok) {
    throw new Error(`The gallery returned status ${res.status}.`);
  }

  const data = (await res.json()) as GalleryResponse;
  if (!data?.success) {
    throw new Error(data?.message ?? 'Could not load the gallery.');
  }

  return data;
}
