import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/shared/lib/cn';

interface GlassHeaderProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  transparent?: boolean;
  edge?: boolean;
}

export function GlassHeader({
  title,
  left,
  right,
  className,
  transparent,
  edge = true,
}: GlassHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn(
        'border-b border-border',
        !transparent && 'bg-black/60',
        className,
      )}
      style={edge ? { paddingTop: insets.top } : undefined}
    >
      <View className="h-14 flex-row items-center gap-sm px-lg">
        {left ? <View className="flex-row items-center">{left}</View> : null}
        {title ? (
          <Text
            className={cn('flex-1 text-h2 font-inter-bold text-foreground', !left && 'pl-0')}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          <View className="flex-1" />
        )}
        {right ? <View className="flex-row items-center gap-xs">{right}</View> : null}
      </View>
    </View>
  );
}
