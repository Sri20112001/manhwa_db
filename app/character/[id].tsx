import { useLocalSearchParams } from 'expo-router';
import { CharacterDetailScreen } from '@/ui/screens/character/CharacterDetailScreen';

export default function CharacterDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const parsedId = Number(id) || 0;
  return <CharacterDetailScreen id={parsedId} />;
}
