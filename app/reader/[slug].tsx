import { useLocalSearchParams } from 'expo-router';
import { ReaderScreen } from '@/ui/screens/reader/ReaderScreen';

export default function ReaderRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <ReaderScreen slug={slug ?? ''} />;
}
