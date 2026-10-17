import { ActivityIndicator, View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

export function Spinner({ className, size = 'small' }: { className?: string; size?: 'small' | 'large' }) {
  const colors = useThemeColors();
  return (
    <View className={cn('items-center justify-center p-lg', className)}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}
