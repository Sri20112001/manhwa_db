import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';

interface ProgressBarProps {
  ratio: number;
  className?: string;
}

export function ProgressBar({ ratio, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, ratio));
  return (
    <View className={cn('h-1 w-full overflow-hidden rounded-pill bg-elevated', className)}>
      <View className="h-full rounded-pill bg-primary" style={{ width: `${clamped * 100}%` }} />
    </View>
  );
}
