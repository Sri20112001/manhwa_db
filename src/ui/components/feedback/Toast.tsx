import { Text, View } from 'react-native';
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { useRootStore } from '@/logic/store';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

export function ToastHost() {
  const toasts = useRootStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <View pointerEvents="none" className="absolute bottom-24 left-lg right-lg gap-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} message={toast.message} variant={toast.variant} />
      ))}
    </View>
  );
}

function ToastItem({ message, variant }: { message: string; variant: 'info' | 'success' | 'error' }) {
  const colors = useThemeColors();
  const Icon = variant === 'success' ? CheckCircle : variant === 'error' ? AlertCircle : Info;
  const tint = variant === 'success' ? colors.success : variant === 'error' ? colors.destructive : colors.info;

  return (
    <View
      accessibilityRole="alert"
      className={cn('flex-row items-center gap-sm rounded-md border border-border bg-elevated px-md py-sm')}
    >
      <Icon size={iconTokens.size.inline} strokeWidth={iconTokens.stroke} color={tint} />
      <Text className="flex-1 text-caption text-foreground">{message}</Text>
    </View>
  );
}
