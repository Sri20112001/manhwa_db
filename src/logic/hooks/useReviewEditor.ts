import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useRootStore } from '@/logic/store';
import { enqueueWriteItem } from '@/logic/usecases/queueTrackingWrite';

import { queryKeys } from '../query/keys';

export interface ReviewSubmission {
  identifier: string;
  pornhwaId: number;
  text: string;
  rating: number | null;
  reviewId?: number;
}

export function useReviewEditor(identifier: string) {
  const queryClient = useQueryClient();
  const draft = useRootStore((state) => state.reviewDrafts[identifier] ?? null);
  const setDraft = useRootStore((state) => state.setReviewDraft);
  const patchDraft = useRootStore((state) => state.patchReviewDraft);
  const clearDraft = useRootStore((state) => state.clearReviewDraft);

  const save = useCallback(
    async (submission: ReviewSubmission) => {
      const hasText = submission.text.trim().length > 0;

      if (submission.rating != null) {
        enqueueWriteItem({
          kind: 'rating.create',
          input: { pornhwaId: submission.pornhwaId, rating: submission.rating },
        });
      } else {
        enqueueWriteItem({
          kind: 'rating.delete',
          input: { pornhwaId: submission.pornhwaId },
        });
      }

      if (hasText) {
        if (submission.reviewId != null) {
          enqueueWriteItem({
            kind: 'review.update',
            input: {
              id: submission.reviewId,
              reviewText: submission.text.trim(),
              rating: submission.rating,
            },
          });
        } else {
          enqueueWriteItem({
            kind: 'review.create',
            input: {
              pornhwaId: submission.pornhwaId,
              reviewText: submission.text.trim(),
              rating: submission.rating,
            },
          });
        }
      } else if (submission.reviewId != null) {
        enqueueWriteItem({ kind: 'review.delete', input: { id: submission.reviewId } });
      }

      clearDraft(identifier);
      void queryClient.invalidateQueries({ queryKey: queryKeys.series(submission.identifier) });
      void queryClient.invalidateQueries({ queryKey: ['tracking'] });
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    [clearDraft, identifier, queryClient],
  );

  const remove = useCallback(
    async (reviewId: number) => {
      enqueueWriteItem({ kind: 'review.delete', input: { id: reviewId } });
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    [queryClient],
  );

  return { draft, setDraft, patchDraft, clearDraft, save, remove };
}
