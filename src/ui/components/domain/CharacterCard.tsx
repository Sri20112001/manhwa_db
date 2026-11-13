import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { cn } from '@/shared/lib/cn';
import { remoteImage } from '@/shared/lib/images';
import type { Character } from '@/shared/types/models';

interface CharacterCardProps {
  character: Character;
  width?: number;
  onPress?: () => void;
  className?: string;
}

export function CharacterCard({ character, width, onPress, className }: CharacterCardProps) {
  const seriesTitle = character.series?.title ?? null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={seriesTitle ? `${character.name}, from ${seriesTitle}` : character.name}
      onPress={onPress}
      disabled={!onPress}
      style={width ? { width } : undefined}
      className={cn('gap-sm', className)}
    >
      <View className="overflow-hidden rounded-md border border-border bg-card">
        <Image
          {...remoteImage(character.image, 'portrait')}
          contentFit="cover"
          style={{ aspectRatio: 3 / 4, width: '100%' }}
          accessibilityIgnoresInvertColors
        />
        {character.role ? (
          <View className="absolute left-sm top-sm rounded-full bg-black/70 px-sm py-[2px]">
            <Text className="font-inter-semibold text-[11px] text-foreground">
              {character.role}
            </Text>
          </View>
        ) : null}
      </View>

      <Text className="text-h3 leading-5 text-foreground" numberOfLines={2}>
        {character.name}
      </Text>

      {seriesTitle ? (
        <Text className="text-caption text-muted" numberOfLines={1}>
          {seriesTitle}
        </Text>
      ) : null}
    </Pressable>
  );
}
