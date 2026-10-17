import type { CharacterDTO } from '@/api/endpoints/catalogue';
import type { Character, SeriesReference } from '@/shared/types/models';

export function toCharacter(dto: CharacterDTO, series?: SeriesReference | null): Character {
  const role = dto.role === 'Main' || dto.role === 'Supporting' ? dto.role : null;
  return {
    id: dto.id ?? 0,
    name: dto.name ?? 'Unknown',
    image: dto.image ?? null,
    role,
    tags: dto.tags ?? [],
    alternativeNames: dto.alternativeNames ?? [],
    description: dto.description ?? null,
    series: series ?? null,
  };
}
