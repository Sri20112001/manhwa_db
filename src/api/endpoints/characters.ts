import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type {
  ChapterDto,
  CharacterDto,
  CharacterRatingDto,
  CharacterReviewDto,
} from '../generated';
import type { QueryParams } from './catalogue';

export type CharacterDTO = CharacterDto;
export type CharacterRatingDTO = CharacterRatingDto;
export type CharacterReviewDTO = CharacterReviewDto;
export type ChapterDTO = ChapterDto;

export function listCharacters(params: QueryParams = {}) {
  return apiRequest<Paginated<CharacterDTO>>({ url: '/characters', params });
}

export function getCharacter(id: number) {
  return apiRequest<Single<CharacterDTO>>({ url: `/characters/${id}` });
}

export function getChapter(id: number) {
  return apiRequest<Single<ChapterDTO>>({ url: `/chapters/${id}` });
}

export function getCharacterRatings(characterId: number, params: QueryParams = {}) {
  return apiRequest<Paginated<CharacterRatingDTO>>({
    url: `/character-ratings/${characterId}`,
    params,
  });
}

export function getCharacterReviews(characterId: number, params: QueryParams = {}) {
  return apiRequest<Paginated<CharacterReviewDTO>>({
    url: `/character-reviews/${characterId}`,
    params,
  });
}
