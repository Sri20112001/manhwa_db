import type { ChapterDTO } from '@/api/endpoints/catalogue';
import type { Chapter } from '@/shared/types/models';

import { toCharacter } from './character';

export function toChapter(dto: ChapterDTO, pornhwaId = 0): Chapter {
  return {
    id: dto.id ?? 0,
    pornhwaId,
    chapterStart: dto.chapterStart ?? 0,
    chapterEnd: dto.chapterEnd ?? null,
    description: dto.description ?? null,
    tags: dto.tags ?? [],
    characters: (dto.characters ?? []).map((character) => toCharacter(character)),
  };
}
