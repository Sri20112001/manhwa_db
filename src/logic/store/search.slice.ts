import type { StateCreator } from 'zustand';

import type { RootState } from './index';

const MAX_RECENT = 8;

export interface SearchSlice {
  searchQuery: string;
  searchSegment: 'series' | 'characters';
  recentSearches: string[];
  setSearchQuery: (query: string) => void;
  setSearchSegment: (segment: 'series' | 'characters') => void;
  pushRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const createSearchSlice: StateCreator<RootState, [], [], SearchSlice> = (set) => ({
  searchQuery: '',
  searchSegment: 'series',
  recentSearches: [],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchSegment: (searchSegment) => set({ searchSegment }),
  pushRecentSearch: (query) =>
    set((state) => {
      const trimmed = query.trim();
      if (!trimmed) return state;
      const next = [trimmed, ...state.recentSearches.filter((item) => item !== trimmed)].slice(
        0,
        MAX_RECENT,
      );
      return { recentSearches: next };
    }),
  removeRecentSearch: (query) =>
    set((state) => ({ recentSearches: state.recentSearches.filter((item) => item !== query) })),
  clearRecentSearches: () => set({ recentSearches: [] }),
});
