import type { StateCreator } from 'zustand';

import type { LibrarySort, LibraryStatusTab, ViewMode } from '@/shared/types/filters';

import type { RootState } from './index';

export interface LibraryUiSlice {
  activeStatusTab: LibraryStatusTab;
  librarySort: LibrarySort;
  libraryViewMode: ViewMode;
  setActiveStatusTab: (tab: LibraryStatusTab) => void;
  setLibrarySort: (sort: LibrarySort) => void;
  setLibraryViewMode: (mode: ViewMode) => void;
  toggleLibraryViewMode: () => void;
}

export const createLibraryUiSlice: StateCreator<RootState, [], [], LibraryUiSlice> = (set) => ({
  activeStatusTab: 'reading',
  librarySort: 'updated',
  libraryViewMode: 'list',
  setActiveStatusTab: (activeStatusTab) => set({ activeStatusTab }),
  setLibrarySort: (librarySort) => set({ librarySort }),
  setLibraryViewMode: (libraryViewMode) => set({ libraryViewMode }),
  toggleLibraryViewMode: () =>
    set((state) => ({ libraryViewMode: state.libraryViewMode === 'list' ? 'grid' : 'list' })),
});
