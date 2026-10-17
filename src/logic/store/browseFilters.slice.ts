import type { StateCreator } from 'zustand';

import { DEFAULT_FILTERS } from '@/shared/types/filters';
import type { BrowseFilters, CatalogueSort, RangeValue } from '@/shared/types/filters';

import type { RootState } from './index';

export interface BrowseFiltersSlice {
  browseFilters: BrowseFilters;
  patchFilters: (patch: Partial<BrowseFilters>) => void;
  toggleStatus: (status: BrowseFilters['status'][number]) => void;
  toggleTag: (tag: string) => void;
  setRatingRange: (range: RangeValue) => void;
  setYearRange: (range: RangeValue) => void;
  setChapterRange: (range: RangeValue) => void;
  setSort: (sort: CatalogueSort, order?: 'asc' | 'desc') => void;
  resetFilters: () => void;
  activeFilterCount: () => number;
}

const isDefaultRange = (range: RangeValue, bounds: RangeValue): boolean =>
  range.min === bounds.min && range.max === bounds.max;

export const createBrowseFiltersSlice: StateCreator<RootState, [], [], BrowseFiltersSlice> = (
  set,
  get,
) => ({
  browseFilters: { ...DEFAULT_FILTERS },
  patchFilters: (patch) => set((state) => ({ browseFilters: { ...state.browseFilters, ...patch } })),
  toggleStatus: (status) =>
    set((state) => {
      const exists = state.browseFilters.status.includes(status);
      const next = exists
        ? state.browseFilters.status.filter((value) => value !== status)
        : [...state.browseFilters.status, status];
      return { browseFilters: { ...state.browseFilters, status: next } };
    }),
  toggleTag: (tag) =>
    set((state) => {
      const exists = state.browseFilters.tags.includes(tag);
      const next = exists
        ? state.browseFilters.tags.filter((value) => value !== tag)
        : [...state.browseFilters.tags, tag];
      return { browseFilters: { ...state.browseFilters, tags: next } };
    }),
  setRatingRange: (rating) => set((state) => ({ browseFilters: { ...state.browseFilters, rating } })),
  setYearRange: (year) => set((state) => ({ browseFilters: { ...state.browseFilters, year } })),
  setChapterRange: (chapters) =>
    set((state) => ({ browseFilters: { ...state.browseFilters, chapters } })),
  setSort: (sort, order) =>
    set((state) => ({
      browseFilters: { ...state.browseFilters, sort, order: order ?? state.browseFilters.order },
    })),
  resetFilters: () => set({ browseFilters: { ...DEFAULT_FILTERS } }),
  activeFilterCount: () => {
    const filters = get().browseFilters;
    let count = filters.status.length + filters.tags.length + filters.characterTags.length;
    if (filters.orientation !== 'any') count += 1;
    if (!isDefaultRange(filters.rating, DEFAULT_FILTERS.rating)) count += 1;
    if (!isDefaultRange(filters.year, DEFAULT_FILTERS.year)) count += 1;
    if (!isDefaultRange(filters.chapters, DEFAULT_FILTERS.chapters)) count += 1;
    return count;
  },
});
