import { useWindowDimensions, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import type { Character } from '@/shared/types/models';
import { CharacterCard } from '@/ui/components/domain/CharacterCard';
import { SkeletonCard } from '@/ui/components/feedback/Skeleton';

interface CharacterGridProps {
  items: Character[];
  onPressItem?: (character: Character) => void;
  onEndReached?: () => void;
  showSkeletons?: boolean;
  ListEmptyComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function CharacterGrid({
  items,
  onPressItem,
  onEndReached,
  showSkeletons,
  ListEmptyComponent,
  refreshing,
  onRefresh,
}: CharacterGridProps) {
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  return (
    <FlashList
      data={items}
      numColumns={numColumns}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View className="flex-1 px-md pb-xl">
          <CharacterCard
            character={item}
            onPress={onPressItem ? () => onPressItem(item) : undefined}
          />
        </View>
      )}
      contentContainerStyle={{ paddingHorizontal: 4, paddingTop: 4 }}
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
