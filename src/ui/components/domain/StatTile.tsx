import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { compactNumber } from '@/shared/lib/format';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface StatTileProps {
  icon: LucideIcon;
  value: number | string;
  caption: string;
  className?: string;
}

export function StatTile({ icon: Icon, value, caption, className }: StatTileProps) {
  const colors = useThemeColors();
  const display = typeof value === 'number' ? compactNumber(value) : value;

  return (
    <View className={cn('flex-1 gap-sm rounded-md border border-border bg-card p-lg', className)}>
      <Icon size={20} strokeWidth={1.75} color={colors.primary} />
      <Text className="text-h1 font-inter-bold text-foreground">{display}</Text>
      <Text className="text-caption text-muted">{caption}</Text>
    </View>
  );
}
