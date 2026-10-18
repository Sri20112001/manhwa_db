import type { CharacterDTO } from '@/api/endpoints/catalogue';
import type { Character, SeriesReference } from '@/shared/types/models';

export function toCharacter(dto: CharacterDTO, series?: SeriesReference | null): Character {
  const role = dto.role === 'Main' || dto.role === 'Supporting' ? dto.role : null;
  const dtoWithPornhwa = dto as typeof dto & {
    pornhwa?: { id?: number; title?: string; slug?: string; coverImage?: string | null };
  };

  const resolvedSeries: SeriesReference | null =
    series && series.title
      ? series
      : dtoWithPornhwa.pornhwa?.title
        ? {
            id: dtoWithPornhwa.pornhwa.id ?? 0,
            title: dtoWithPornhwa.pornhwa.title,
            slug: dtoWithPornhwa.pornhwa.slug ?? '',
            coverImage: dtoWithPornhwa.pornhwa.coverImage ?? null,
          }
        : series ?? null;

  return {
    id: dto.id ?? 0,
    name: dto.name ?? 'Unknown',
    image: dto.image ?? null,
    role,
    tags: dto.tags ?? [],
    alternativeNames: dto.alternativeNames ?? [],
    description: dto.description ?? null,
    series: resolvedSeries,
  };
}
