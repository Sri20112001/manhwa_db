import { Modal, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { GalleryPanel } from '@/api/endpoints/gallery';
import { remoteImage } from '@/shared/lib/images';
import { Button } from '@/ui/components/primitives/Button';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Heart, X } from '@/ui/icons';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface GalleryViewerProps {
  panel: GalleryPanel | null;
  onClose: () => void;
  onOpenSeries?: (slug: string) => void;
}

export function GalleryViewer({ panel, onClose, onOpenSeries }: GalleryViewerProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const slug = panel?.pornhwa_slug ?? null;
  const chapter =
    panel?.chapter_start ?? panel?.gallery_chapter_number ?? panel?.chapter_sort ?? null;

  return (
    <Modal
      visible={Boolean(panel)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        {panel ? (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close image"
              onPress={onClose}
              className="flex-1"
            >
              <Image
                {...remoteImage(panel.image_path, 'portrait')}
                contentFit="contain"
                style={{ flex: 1 }}
                accessibilityLabel={
                  panel.pornhwa_title ? `Panel from ${panel.pornhwa_title}` : 'Gallery panel'
                }
                accessibilityIgnoresInvertColors
              />
            </Pressable>

            <View
              style={{ paddingTop: insets.top + 8 }}
              className="absolute inset-x-0 top-0 flex-row items-center gap-sm bg-black/50 px-lg pb-sm"
            >
              <Text
                className="flex-1 font-inter-semibold text-h3 text-foreground"
                numberOfLines={1}
              >
                {panel.pornhwa_title ?? 'Gallery'}
              </Text>
              <IconButton icon={X} accessibilityLabel="Close image" onPress={onClose} />
            </View>

            <View
              style={{ paddingBottom: insets.bottom + 12 }}
              className="absolute inset-x-0 bottom-0 gap-md bg-black/60 px-lg pt-md"
            >
              <View className="flex-row items-center gap-md">
                <View className="flex-row items-center gap-xs">
                  <Heart
                    size={14}
                    color={panel.user_has_liked ? colors.primary : colors.foreground}
                    fill={panel.user_has_liked ? colors.primary : 'transparent'}
                  />
                  <Text className="font-inter-semibold text-caption text-foreground">
                    {panel.total_likes} likes
                  </Text>
                </View>
                {panel.uploader_username ? (
                  <Text className="flex-1 text-caption text-muted" numberOfLines={1}>
                    by {panel.uploader_username}
                  </Text>
                ) : null}
                {chapter != null ? (
                  <Text className="text-caption text-muted">Ch. {chapter}</Text>
                ) : null}
              </View>

              {slug && onOpenSeries ? (
                <Button
                  label="Open series"
                  size="sm"
                  variant="secondary"
                  onPress={() => onOpenSeries(slug)}
                  fullWidth
                />
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    </Modal>
  );
}
