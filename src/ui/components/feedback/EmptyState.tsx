import { Text, View } from 'react-native';
import { ImageOff, type LucideIcon } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  caption?: string;
  className?: string;
}

export function EmptyState({ icon: Icon = ImageOff, title, description, caption, className }: EmptyStateProps) {
  const colors = useThemeColors();
  const subtext = description ?? caption;

  return (
    <View className={cn('items-center justify-center gap-md px-lg py-2xl', className)}>
      <Icon size={40} strokeWidth={1.5} color={colors.border} />
      {title ? <Text className="text-center text-h3 font-inter-bold text-foreground">{title}</Text> : null}
      {subtext ? <Text className="text-center text-caption text-muted">{subtext}</Text> : null}
    </View>
  );
}
