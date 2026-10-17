import { apiRequest } from '../client';
import type { Single } from '../envelope';
import type { QueryParams } from './catalogue';

export type TagType = 'genre' | 'character' | 'chapter';

export interface TagGroups {
  genre: string[];
  character: string[];
  chapter: string[];
}

export function listTags() {
  return apiRequest<Single<TagGroups>>({ url: '/tags' });
}

export function listTagsByType(type: TagType) {
  return apiRequest<Single<string[]>>({ url: `/tags/${type}` });
}

export interface AvailableTagsParams extends QueryParams {
  type: TagType;
  selectedTags?: string;
  tagMode?: 'any' | 'all';
  status?: string;
  search?: string;
}

export function getAvailableTags(params: AvailableTagsParams) {
  const { selectedTags, ...rest } = params;
  return apiRequest<Single<string[]>>({
    url: '/tags/available',
    params: { ...rest, ...(selectedTags ? { tags: selectedTags } : {}) },
  });
}
