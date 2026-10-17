import { useLocalSearchParams } from 'expo-router';
import { SeriesDetailScreen } from '@/ui/screens/series/SeriesDetailScreen';

export default function SeriesDetailRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <SeriesDetailScreen slug={slug ?? ''} />;
}
