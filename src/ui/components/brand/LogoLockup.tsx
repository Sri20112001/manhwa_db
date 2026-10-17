import { Text, View } from 'react-native';

import { LogoMark } from './LogoMark';

interface LogoLockupProps {
  markSize?: number;
  compact?: boolean;
}

export function LogoLockup({ markSize = 32, compact }: LogoLockupProps) {
  return (
    <View className="flex-row items-center gap-sm" accessibilityRole="image">
      <LogoMark size={markSize} />
      {!compact ? (
        <View>
          <Text className="text-h3 font-inter-bold text-foreground">Pornhwa</Text>
          <Text className="text-[10px] font-inter-bold tracking-[3px] text-primary">DATABASE</Text>
        </View>
      ) : null}
    </View>
  );
}
