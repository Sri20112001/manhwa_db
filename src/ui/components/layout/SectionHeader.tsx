import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { IconButton } from '@/ui/components/primitives/IconButton';

interface SectionHeaderProps {
  title: string;
  onPressMore?: () => void;
  onPress?: () => void;
  moreLabel?: string;
  accessibilityLabel?: string;
  trailing?: React.ReactNode;
  right?: React.ReactNode;
  icon?: LucideIcon;
  onPressIcon?: () => void;
  iconLabel?: string;
}

export function SectionHeader({
  title,
  onPressMore,
  onPress,
  moreLabel,
  accessibilityLabel,
  trailing,
  right,
  icon: Icon,
  onPressIcon,
  iconLabel,
}: SectionHeaderProps) {
  const handleMore = onPress ?? onPressMore;
  const label = accessibilityLabel ?? moreLabel ?? `View all ${title}`;
  const rightContent = right ?? trailing;

  return (
    <View className="flex-row items-center justify-between px-lg py-md">
      <Text className="text-h2 font-inter-bold text-foreground">{title}</Text>
      <View className="flex-row items-center gap-xs">
        {rightContent}
        {Icon ? <IconButton icon={Icon} accessibilityLabel={iconLabel ?? title} onPress={onPressIcon} /> : null}
        {handleMore ? (
          <IconButton
            icon={ChevronRight}
            accessibilityLabel={label}
            onPress={handleMore}
            variant="surface"
            size={20}
          />
        ) : null}
      </View>
    </View>
  );
}
