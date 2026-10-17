import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { ListWriteInput } from '@/api/endpoints/lists';
import { useRootStore } from '@/logic/store';
import { enqueueWriteItem } from '@/logic/usecases/queueTrackingWrite';

import { queryKeys } from '../query/keys';

export function useListEditor() {
  const queryClient = useQueryClient();
  const draft = useRootStore((state) => state.listDraft);
  const patchDraft = useRootStore((state) => state.patchListDraft);
  const toggleItem = useRootStore((state) => state.toggleListItem);
  const resetDraft = useRootStore((state) => state.resetListDraft);

  const save = useCallback(
    async (input: ListWriteInput) => {
      enqueueWriteItem({ kind: 'list.create', input });
      void queryClient.invalidateQueries({ queryKey: queryKeys.lists({}) });
      resetDraft();
    },
    [queryClient, resetDraft],
  );

  const update = useCallback(
    async (username: string, slug: string, input: Partial<ListWriteInput>) => {
      enqueueWriteItem({ kind: 'list.update', username, slug, input });
      void queryClient.invalidateQueries({ queryKey: queryKeys.list(username, slug) });
    },
    [queryClient],
  );

  const remove = useCallback(
    async (username: string, slug: string) => {
      enqueueWriteItem({ kind: 'list.delete', username, slug });
      void queryClient.invalidateQueries({ queryKey: queryKeys.lists({}) });
    },
    [queryClient],
  );

  return { draft, patchDraft, toggleItem, resetDraft, save, update, remove };
}
