import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  fetchReaderChapter,
  type ReaderChapterDetail,
} from '@/api/endpoints/reader';
import { queryKeys } from '@/logic/query/keys';
import { useRootStore } from '@/logic/store';
import { STALE } from '@/shared/constants/query';

export function useReaderChapter(slug: string, chapter: number | string) {
  const setLastChapter = useRootStore((state) => state.setLastChapter);

  const query = useQuery<ReaderChapterDetail, Error>({
    queryKey: queryKeys.readerChapter(slug, chapter),
    queryFn: ({ signal }) => fetchReaderChapter(slug, chapter, signal),
    enabled: Boolean(slug && chapter !== undefined && chapter !== ''),
    staleTime: STALE.reader,
    retry: (failureCount, error) => {
      // Don't retry on 404s
      if ('status' in error && error.status === 404) return false;
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (query.data && query.data.number) {
      setLastChapter(slug, query.data.number);
    }
  }, [query.data, slug, setLastChapter]);

  return {
    chapterDetail: query.data ?? null,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
