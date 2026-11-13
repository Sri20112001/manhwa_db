import { useLocalSearchParams } from 'expo-router';

import { ChapterReaderScreen } from '@/ui/screens/reader/ChapterReaderScreen';

export default function ChapterReadRoute() {
  const { slug, chapter } = useLocalSearchParams<{ slug: string; chapter: string }>();

  return <ChapterReaderScreen slug={slug ?? ''} chapter={chapter ?? '1'} />;
}
