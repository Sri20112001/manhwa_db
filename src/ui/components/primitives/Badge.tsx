import { Text, View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { compactNumber } from '@/shared/lib/format';

interface BadgeProps {
  count?: number;
  label?: string;
  tone?: 'primary' | 'neutral' | 'destructive';
  className?: string;
}

export function Badge({ count, label, tone = 'primary', className }: BadgeProps) {
  const text = label ?? (count != null ? compactNumber(count) : '');
  if (!text) return null;

  return (
    <View
      className={cn(
        'min-w-[18px] items-center justify-center rounded-pill px-xs py-[1px]',
        tone === 'primary' && 'bg-primary',
        tone === 'neutral' && 'bg-elevated',
        tone === 'destructive' && 'bg-destructive',
        className,
      )}
      accessibilityRole="text"
      accessibilityLabel={label ?? `${count} items`}
    >
      <Text className="text-[10px] font-inter-bold text-on-primary">{text}</Text>
    </View>
  );
}
