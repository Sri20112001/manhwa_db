import { Text, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';

import { errorMessage } from '@/api/errors';
import { Button } from '@/ui/components/primitives/Button';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

export interface ErrorStateProps {
  error?: unknown;
  title?: string;
  description?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, title, description, message, onRetry }: ErrorStateProps) {
  const colors = useThemeColors();
  const text = description ?? message ?? (error ? errorMessage(error) : 'Something went wrong.');

  return (
    <View className="items-center justify-center gap-md px-lg py-2xl">
      <WifiOff size={40} strokeWidth={1.5} color={colors.border} />
      {title ? <Text className="text-center text-h3 font-inter-bold text-foreground">{title}</Text> : null}
      <Text className="text-center text-body text-muted">{text}</Text>
      {onRetry ? <Button label="Retry" variant="outline" size="sm" onPress={onRetry} /> : null}
    </View>
  );
}
