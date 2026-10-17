import { Text, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

interface RankChipProps {
  rank: number;
  className?: string;
}

export function RankChip({ rank, className }: RankChipProps) {
  const top = rank <= 3;
  return (
    <View
      className={cn(
        'h-7 w-7 items-center justify-center rounded-pill',
        top ? 'bg-primary' : 'bg-elevated',
        className,
      )}
    >
      <Text className={cn('text-caption font-inter-bold', top ? 'text-on-primary' : 'text-muted')}>
        {rank}
      </Text>
    </View>
  );
}
