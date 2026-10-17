import type { StateCreator } from 'zustand';

import type { ReviewEditorDraft } from '@/shared/types/filters';

import type { RootState } from './index';

export interface ReviewEditorSlice {
  reviewDrafts: Record<string, ReviewEditorDraft>;
  setReviewDraft: (draft: ReviewEditorDraft) => void;
  patchReviewDraft: (identifier: string, patch: Partial<ReviewEditorDraft>) => void;
  clearReviewDraft: (identifier: string) => void;
}

export const createReviewEditorSlice: StateCreator<RootState, [], [], ReviewEditorSlice> = (set) => ({
  reviewDrafts: {},
  setReviewDraft: (draft) =>
    set((state) => ({ reviewDrafts: { ...state.reviewDrafts, [draft.identifier]: draft } })),
  patchReviewDraft: (identifier, patch) =>
    set((state) => {
      const existing = state.reviewDrafts[identifier] ?? {
        identifier,
        text: '',
        rating: null,
      };
      return { reviewDrafts: { ...state.reviewDrafts, [identifier]: { ...existing, ...patch } } };
    }),
  clearReviewDraft: (identifier) =>
    set((state) => {
      const next = { ...state.reviewDrafts };
      delete next[identifier];
      return { reviewDrafts: next };
    }),
});
