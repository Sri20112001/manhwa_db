import { searchGlobal } from '@/api/endpoints/search';
import type { SearchEnvelope } from '@/api/envelope';
import { toSeriesFromHit } from '@/logic/mappers/pornhwa';
import type { Series } from '@/shared/types/models';

export interface SearchCharacterResult {
  id: number;
  name: string;
  image: string | null;
  seriesTitle: string | null;
  seriesSlug: string | null;
}

export interface ResolvedSearchPage {
  items: (Series | SearchCharacterResult)[];
  total: number;
  hasMore: boolean;
  page: number;
  nextPage: number | null;
}

export async function resolveSearch(
  query: string,
  segment: 'series' | 'characters',
  page: number,
): Promise<ResolvedSearchPage> {
  const envelope: SearchEnvelope = await searchGlobal({
    q: query,
    type: segment === 'series' ? 'pornhwa' : 'character',
    page,
    limit: 20,
  });

  if (segment === 'series') {
    const items = (envelope.data.pornhwa ?? []).map((hit) => toSeriesFromHit(hit));
    const pagination = envelope.pagination.pornhwa;
    return {
      items,
      total: pagination?.total ?? items.length,
      hasMore: pagination?.hasMore ?? false,
      page,
      nextPage: pagination?.hasMore ? page + 1 : null,
    };
  }

  const items: SearchCharacterResult[] = (envelope.data.characters ?? []).map((hit) => ({
    id: hit.id,
    name: hit.name,
    image: hit.image,
    seriesTitle: hit.pornhwaTitle,
    seriesSlug: hit.pornhwaSlug,
  }));
  const pagination = envelope.pagination.characters;
  return {
    items,
    total: pagination?.total ?? items.length,
    hasMore: pagination?.hasMore ?? false,
    page,
    nextPage: pagination?.hasMore ? page + 1 : null,
  };
}
