import { Pressable, Text, View } from 'react-native';
import { X, type LucideIcon } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: LucideIcon;
  onRemove?: () => void;
  tone?: 'default' | 'soft' | 'outline' | 'primary';
  className?: string;
}

export function Chip({
  label,
  active,
  onPress,
  icon: Icon,
  onRemove,
  tone = 'default',
  className,
}: ChipProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(active) }}
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'flex-row items-center gap-xs rounded-pill border px-md py-sm',
        active
          ? 'border-primary bg-primary'
          : tone === 'soft'
            ? 'border-transparent bg-primary-soft'
            : tone === 'primary'
              ? 'border-primary/40 bg-primary/10'
              : 'border-border bg-transparent',
        className,
      )}
    >
      {Icon ? (
        <Icon
          size={iconTokens.size.inline}
          strokeWidth={iconTokens.stroke}
          color={
            active
              ? colors.onPrimary
              : tone === 'soft' || tone === 'primary'
                ? colors.primary
                : colors.muted
          }
        />
      ) : null}
      <Text
        className={cn(
          'text-caption font-inter-medium',
          active
            ? 'text-on-primary'
            : tone === 'soft' || tone === 'primary'
              ? 'text-primary'
              : 'text-muted',
        )}
      >
        {label}
      </Text>
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          hitSlop={6}
          onPress={onRemove}
        >
          <X size={14} strokeWidth={iconTokens.stroke} color={colors.muted} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

interface ChipRowProps {
  children: React.ReactNode;
}

export function ChipRow({ children }: ChipRowProps) {
  return <View className="flex-row flex-wrap gap-sm">{children}</View>;
}
