import { View } from 'react-native';
import { Image } from 'expo-image';

import { cn } from '@/shared/lib/cn';
import { remoteImage } from '@/shared/lib/images';

interface CollageProps {
  images: string[];
  size?: number;
  className?: string;
}

export function Collage({ images, size = 96, className }: CollageProps) {
  const slots = [0, 1, 2, 3].map((index) => images[index] ?? null);
  const cell = size / 2 - 1;

  return (
    <View
      className={cn('flex-row flex-wrap overflow-hidden rounded-md border border-border bg-card', className)}
      style={{ width: size, height: size }}
    >
      {slots.map((uri, index) => (
        <View
          key={index}
          style={{ width: cell, height: cell }}
          className={cn('bg-elevated', index % 2 === 0 ? 'mr-[1px]' : '', index < 2 ? 'mb-[1px]' : '')}
        >
          <Image
            {...remoteImage(uri)}
            contentFit="cover"
            style={{ width: '100%', height: '100%' }}
            accessibilityIgnoresInvertColors
          />
        </View>
      ))}
    </View>
  );
}
