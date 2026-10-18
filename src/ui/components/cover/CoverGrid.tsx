import { useWindowDimensions, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { CoverCard } from './CoverCard';
import type { Series } from '@/shared/types/models';
import { SkeletonCard } from '@/ui/components/feedback/Skeleton';

interface CoverGridProps {
  items: Series[];
  onPressItem?: (series: Series) => void;
  onEndReached?: () => void;
  showSkeletons?: boolean;
  ListHeaderComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function CoverGrid({
  items,
  onPressItem,
  onEndReached,
  showSkeletons,
  ListHeaderComponent,
  ListEmptyComponent,
  refreshing,
  onRefresh,
}: CoverGridProps) {
  const { width } = useWindowDimensions();
  // 2 columns for phones (<600px), 3 for tablets/foldables (<900px), 4+ for large web screens
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  return (
    <FlashList
      data={items}
      numColumns={numColumns}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View className="flex-1 px-md pb-xl">
          <CoverCard series={item} onPress={onPressItem ? () => onPressItem(item) : undefined} />
        </View>
      )}
      contentContainerStyle={{ paddingHorizontal: 4, paddingTop: 4 }}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={
        showSkeletons ? (
          <View className="flex-row gap-xl px-md pb-xl">
            <View className="flex-1">
              <SkeletonCard />
            </View>
            <View className="flex-1">
              <SkeletonCard />
            </View>
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
