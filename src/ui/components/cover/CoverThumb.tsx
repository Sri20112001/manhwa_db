import { View } from 'react-native';
import { Image } from 'expo-image';

import { cn } from '@/shared/lib/cn';
import { remoteImage } from '@/shared/lib/images';

interface CoverThumbProps {
  uri: string | null;
  width?: number;
  height?: number;
  className?: string;
}

export function CoverThumb({ uri, width, height, className }: CoverThumbProps) {
  return (
    <View
      className={cn('overflow-hidden rounded-sm border border-border bg-card', className)}
      style={{ width, height }}
    >
      <Image
        {...remoteImage(uri)}
        contentFit="cover"
        style={{ width: '100%', height: '100%' }}
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}
