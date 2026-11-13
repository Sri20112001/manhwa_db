import { ActivityIndicator, useWindowDimensions, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import type { GalleryPanel } from '@/api/endpoints/gallery';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { Skeleton } from '@/ui/components/feedback/Skeleton';
import { GalleryCard } from '@/ui/components/domain/GalleryCard';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface GalleryGridProps {
  panels: GalleryPanel[];
  onPressPanel?: (panel: GalleryPanel) => void;
  onEndReached?: () => void;
  isPending?: boolean;
  isFetchingNextPage?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function GalleryGrid({
  panels,
  onPressPanel,
  onEndReached,
  isPending,
  isFetchingNextPage,
  refreshing,
  onRefresh,
}: GalleryGridProps) {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  return (
    <FlashList
      data={panels}
      numColumns={numColumns}
      masonry
      optimizeItemArrangement
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={{ padding: 4 }}>
          <GalleryCard panel={item} onPress={onPressPanel ? () => onPressPanel(item) : undefined} />
        </View>
      )}
      contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 4 }}
      ListEmptyComponent={
        isPending ? (
          <View className="flex-row flex-wrap">
            {Array.from({ length: numColumns * 2 }).map((_, index) => (
              <View key={index} style={{ width: `${100 / numColumns}%` }} className="p-xs">
                <Skeleton
                  className={index % 2 === 0 ? 'aspect-square w-full' : 'aspect-[3/4] w-full'}
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="py-2xl">
            <EmptyState
              title="No panels found"
              description="Try a different search or check back after more uploads."
            />
          </View>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center py-lg">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
}
