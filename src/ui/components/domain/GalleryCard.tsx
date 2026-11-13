import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { remoteImage } from '@/shared/lib/images';
import type { GalleryPanel } from '@/api/endpoints/gallery';
import { Heart } from '@/ui/icons';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface GalleryCardProps {
  panel: GalleryPanel;
  onPress?: () => void;
}

function panelAspectRatio(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0.7;
  // Keep extreme crops from producing unusably tall or short tiles.
  return Math.min(Math.max(parsed, 0.5), 1.6);
}

export function GalleryCard({ panel, onPress }: GalleryCardProps) {
  const colors = useThemeColors();
  const chapter = panel.chapter_start ?? panel.gallery_chapter_number ?? panel.chapter_sort;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        panel.pornhwa_title
          ? `Gallery panel from ${panel.pornhwa_title}${chapter != null ? `, chapter ${chapter}` : ''}`
          : 'Gallery panel'
      }
      onPress={onPress}
      disabled={!onPress}
      className="overflow-hidden rounded-md border border-border bg-card active:opacity-80"
    >
      <Image
        {...remoteImage(panel.image_path, 'portrait')}
        contentFit="cover"
        style={{ aspectRatio: panelAspectRatio(panel.aspect_ratio), width: '100%' }}
        accessibilityIgnoresInvertColors
      />

      <View className="absolute inset-x-0 bottom-0 flex-row items-center gap-xs bg-black/60 px-sm py-xs">
        <Heart
          size={12}
          color={panel.user_has_liked ? colors.primary : colors.foreground}
          fill={panel.user_has_liked ? colors.primary : 'transparent'}
        />
        <Text className="font-inter-semibold text-[11px] text-foreground">{panel.total_likes}</Text>
        {panel.pornhwa_title ? (
          <Text className="ml-auto flex-1 text-right text-[11px] text-muted" numberOfLines={1}>
            {panel.pornhwa_title}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
