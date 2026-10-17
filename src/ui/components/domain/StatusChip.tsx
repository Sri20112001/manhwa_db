import { Text, View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { PUBLICATION_STATUS_LABEL, type PublicationStatus } from '@/shared/constants/status';

export type StatusInput = PublicationStatus | 'ongoing' | 'completed' | 'hiatus' | string | null;

interface StatusChipProps {
  status: StatusInput;
  className?: string;
}

const NORMALIZE: Record<string, PublicationStatus> = {
  'On Going': 'On Going',
  'ongoing': 'On Going',
  'Completed': 'Completed',
  'completed': 'Completed',
  'Hiatus': 'Hiatus',
  'hiatus': 'Hiatus',
};

const CHIP: Record<PublicationStatus, string> = {
  'On Going': 'bg-status-ongoing-bg',
  Completed: 'bg-status-completed-bg',
  Hiatus: 'bg-status-hiatus-bg',
};

const TEXT: Record<PublicationStatus, string> = {
  'On Going': 'text-status-ongoing-text',
  Completed: 'text-status-completed-text',
  Hiatus: 'text-status-hiatus-text',
};

export function StatusChip({ status, className }: StatusChipProps) {
  if (!status) return null;
  const canonical = NORMALIZE[status] ?? ('On Going' as PublicationStatus);

  return (
    <View className={cn('rounded-pill px-sm py-[2px]', CHIP[canonical], className)}>
      <Text className={cn('text-[11px] font-inter-semibold', TEXT[canonical])}>
        {PUBLICATION_STATUS_LABEL[canonical]}
      </Text>
    </View>
  );
}
