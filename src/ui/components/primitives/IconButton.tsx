import { Pressable } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface IconButtonProps {
  icon: LucideIcon;
  accessibilityLabel: string;
  onPress?: () => void;
  size?: number;
  strokeWidth?: number;
  variant?: 'plain' | 'surface' | 'primary-soft' | 'primary';
  disabled?: boolean;
  className?: string;
}

export function IconButton({
  icon: Icon,
  accessibilityLabel,
  onPress,
  size = iconTokens.size.action,
  strokeWidth = iconTokens.stroke,
  variant = 'plain',
  disabled,
  className,
}: IconButtonProps) {
  const colors = useThemeColors();

  const iconColor =
    variant === 'primary'
      ? colors.onPrimary
      : variant === 'primary-soft'
        ? colors.primary
        : colors.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      className={cn(
        'h-11 w-11 items-center justify-center rounded-full active:opacity-70',
        variant === 'surface' && 'bg-card border border-border',
        variant === 'primary-soft' && 'bg-primary-soft',
        variant === 'primary' && 'bg-primary',
        disabled && 'opacity-40',
        className,
      )}
    >
      <Icon size={size} strokeWidth={strokeWidth} color={iconColor} />
    </Pressable>
  );
}
