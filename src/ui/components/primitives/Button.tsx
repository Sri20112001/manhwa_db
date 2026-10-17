import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { iconTokens } from '@/ui/theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  trailingIcon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
}

const CONTAINER: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-elevated',
  outline: 'bg-transparent border border-border',
  ghost: 'bg-transparent',
  destructive: 'bg-destructive',
};

const LABEL: Record<ButtonVariant, string> = {
  primary: 'text-on-primary',
  secondary: 'text-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  destructive: 'text-on-primary',
};

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-9 px-md',
  md: 'h-11 px-lg',
  lg: 'h-12 px-lg',
};

const TEXT_SIZE: Record<ButtonSize, string> = {
  sm: 'text-caption',
  md: 'text-body',
  lg: 'text-body',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  trailingIcon: TrailingIcon,
  disabled,
  loading,
  fullWidth,
  accessibilityHint,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const iconColor = variant === 'primary' || variant === 'destructive' ? '#FFFFFF' : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(isDisabled), busy: Boolean(loading) }}
      disabled={isDisabled}
      onPress={onPress}
      className={cn(
        'flex-row items-center justify-center gap-sm rounded-md active:opacity-80',
        CONTAINER[variant],
        SIZE[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
      )}
    >
      {loading ? (
        <ActivityIndicator color={iconColor ?? '#FFFFFF'} />
      ) : (
        <>
          {Icon ? (
            <Icon size={iconTokens.size.inline} strokeWidth={iconTokens.stroke} color={iconColor} />
          ) : null}
          <Text className={cn('font-inter-semibold', LABEL[variant], TEXT_SIZE[size])}>{label}</Text>
          {TrailingIcon ? (
            <TrailingIcon
              size={iconTokens.size.inline}
              strokeWidth={iconTokens.stroke}
              color={iconColor}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}
