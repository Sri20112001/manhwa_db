import { useLocalSearchParams } from 'expo-router';
import { ReviewEditorScreen } from '@/ui/screens/review/ReviewEditorScreen';

export default function ReviewEditorRoute() {
  const { identifier } = useLocalSearchParams<{ identifier: string }>();
  return <ReviewEditorScreen identifier={identifier ?? ''} />;
}
