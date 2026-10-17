import { View } from 'react-native';
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
  return (
    <FlashList
      data={items}
      numColumns={2}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View className="flex-1 px-sm pb-lg">
          <CoverCard series={item} onPress={onPressItem ? () => onPressItem(item) : undefined} />
        </View>
      )}
      contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={
        showSkeletons ? (
          <View className="flex-row gap-md px-sm pb-lg">
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
