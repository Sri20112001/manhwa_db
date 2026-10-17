import type { StateCreator } from 'zustand';

import type { ListEditorDraft } from '@/shared/types/filters';

import type { RootState } from './index';

export const EMPTY_LIST_DRAFT: ListEditorDraft = {
  title: '',
  description: '',
  isPublic: true,
  isCollaborative: false,
  itemIds: [],
};

export interface ListEditorSlice {
  listDraft: ListEditorDraft;
  setListDraft: (draft: ListEditorDraft) => void;
  patchListDraft: (patch: Partial<ListEditorDraft>) => void;
  toggleListItem: (pornhwaId: number) => void;
  resetListDraft: () => void;
}

export const createListEditorSlice: StateCreator<RootState, [], [], ListEditorSlice> = (set) => ({
  listDraft: { ...EMPTY_LIST_DRAFT },
  setListDraft: (listDraft) => set({ listDraft }),
  patchListDraft: (patch) => set((state) => ({ listDraft: { ...state.listDraft, ...patch } })),
  toggleListItem: (pornhwaId) =>
    set((state) => {
      const exists = state.listDraft.itemIds.includes(pornhwaId);
      const itemIds = exists
        ? state.listDraft.itemIds.filter((id) => id !== pornhwaId)
        : [...state.listDraft.itemIds, pornhwaId];
      return { listDraft: { ...state.listDraft, itemIds } };
    }),
  resetListDraft: () => set({ listDraft: { ...EMPTY_LIST_DRAFT } }),
});
