import { useLocalSearchParams } from 'expo-router';
import { ProfileScreen } from '@/ui/screens/profile/ProfileScreen';

export default function UserProfileRoute() {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  return <ProfileScreen uid={uid} />;
}
