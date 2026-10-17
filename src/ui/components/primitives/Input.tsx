import { Platform, TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface InputProps extends Omit<TextInputProps, 'className'> {
  leadingIcon?: LucideIcon;
  trailing?: React.ReactNode;
  containerClassName?: string;
  mono?: boolean;
}

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

export function Input({
  leadingIcon: LeadingIcon,
  trailing,
  containerClassName,
  mono,
  style,
  ...props
}: InputProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cn(
        'flex-row items-center gap-sm rounded-md border border-border bg-card px-md',
        containerClassName,
      )}
    >
      {LeadingIcon ? (
        <LeadingIcon
          size={iconTokens.size.inline}
          strokeWidth={iconTokens.stroke}
          color={colors.muted}
        />
      ) : null}
      <TextInput
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
        {...props}
        className="h-11 flex-1 text-body text-foreground"
        style={[mono ? { fontFamily: MONO } : null, style]}
      />
      {trailing}
    </View>
  );
}
