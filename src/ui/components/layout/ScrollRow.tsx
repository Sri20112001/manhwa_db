import { FlashList } from '@shopify/flash-list';
import { ScrollView, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

interface ScrollRowProps<T = unknown> {
  children?: React.ReactNode;
  data?: readonly T[];
  renderItem?: (item: T, index: number) => React.ReactElement | null;
  keyExtractor?: (item: T, index: number) => string;
  ItemSeparator?: React.ComponentType;
  className?: string;
  contentClassName?: string;
}

const Separator = () => <View className="w-lg" />;

export function ScrollRow<T>({
  children,
  data,
  renderItem,
  keyExtractor,
  ItemSeparator = Separator,
  className,
  contentClassName,
}: ScrollRowProps<T>) {
  if (children) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        className={cn('flex-grow-0', className)}
        contentContainerClassName={contentClassName}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <FlashList
      horizontal
      data={data ?? []}
      renderItem={({ item, index }) => (renderItem ? renderItem(item, index) : null)}
      keyExtractor={keyExtractor ?? ((_, i) => String(i))}
      ItemSeparatorComponent={ItemSeparator}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      className={cn('flex-grow-0', className)}
      contentContainerClassName={contentClassName}
    />
  );
}
