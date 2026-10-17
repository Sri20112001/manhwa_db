import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { initials } from '@/shared/lib/format';
import { BLURHASH } from '@/shared/lib/images';
import { cn } from '@/shared/lib/cn';

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  ring?: boolean;
  className?: string;
}

export function Avatar({ uri, name, size = 40, ring, className }: AvatarProps) {
  const radius = size / 2;

  return (
    <View
      className={cn('items-center justify-center', ring && 'border-2 border-primary', className)}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          placeholder={BLURHASH.avatar}
          contentFit="cover"
          transition={200}
          style={{ width: size, height: size, borderRadius: radius }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View
          className="items-center justify-center bg-elevated"
          style={{ width: size, height: size, borderRadius: radius }}
        >
          <Text className="font-inter-semibold text-muted" style={{ fontSize: size * 0.36 }}>
            {initials(name)}
          </Text>
        </View>
      )}
    </View>
  );
}
