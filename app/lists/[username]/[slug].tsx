import { useLocalSearchParams } from 'expo-router';
import { ListDetailScreen } from '@/ui/screens/lists/ListDetailScreen';

export default function ListDetailRoute() {
  const { username, slug } = useLocalSearchParams<{ username: string; slug: string }>();
  return <ListDetailScreen username={username ?? ''} slug={slug ?? ''} />;
}
