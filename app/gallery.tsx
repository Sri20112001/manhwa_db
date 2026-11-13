import { useLocalSearchParams } from 'expo-router';

import { GalleryScreen } from '@/ui/screens/gallery/GalleryScreen';

export default function GalleryRoute() {
  const { pornhwaId, pornhwaTitle, characterId, characterName } =
    useLocalSearchParams<{
      pornhwaId?: string;
      pornhwaTitle?: string;
      characterId?: string;
      characterName?: string;
    }>();

  return (
    <GalleryScreen
      initialPornhwaId={pornhwaId ? Number(pornhwaId) : undefined}
      initialPornhwaTitle={pornhwaTitle}
      initialCharacterId={characterId ? Number(characterId) : undefined}
      initialCharacterName={characterName}
    />
  );
}
