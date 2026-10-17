import type { StateCreator } from 'zustand';

import type { RootState } from './index';

export interface ReaderPrefsSlice {
  readerView: 'list' | 'grid';
  lastChapter: Record<string, number>;
  setReaderView: (view: 'list' | 'grid') => void;
  setLastChapter: (slug: string, chapter: number) => void;
}

export const createReaderPrefsSlice: StateCreator<RootState, [], [], ReaderPrefsSlice> = (set) => ({
  readerView: 'list',
  lastChapter: {},
  setReaderView: (readerView) => set({ readerView }),
  setLastChapter: (slug, chapter) =>
    set((state) => ({ lastChapter: { ...state.lastChapter, [slug]: chapter } })),
});
