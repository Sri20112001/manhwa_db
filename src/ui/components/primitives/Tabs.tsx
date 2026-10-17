import { Pressable, ScrollView, Text, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

export interface TabItem<T extends string> {
  value?: T;
  id?: T;
  label: string;
}

export interface TabsProps<T extends string> {
  items?: TabItem<T>[];
  tabs?: TabItem<T>[];
  value?: T;
  activeTab?: T;
  onChange?: (value: T) => void;
  onChangeTab?: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  items,
  tabs,
  value,
  activeTab,
  onChange,
  onChangeTab,
  className,
}: TabsProps<T>) {
  const tabList = items ?? tabs ?? [];
  const current = value ?? activeTab ?? ('' as T);
  const handleChange = onChange ?? onChangeTab ?? (() => {});

  return (
    <View className={cn('border-b border-border', className)}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-lg px-lg">
          {tabList.map((item) => {
            const itemKey = (item.value ?? item.id ?? '') as T;
            const active = itemKey === current;
            return (
              <Pressable
                key={itemKey}
                accessibilityRole="tab"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: active }}
                onPress={() => handleChange(itemKey)}
                className="pb-sm pt-xs"
              >
                <Text
                  className={cn(
                    'text-h3 font-inter-semibold',
                    active ? 'text-foreground' : 'text-muted',
                  )}
                >
                  {item.label}
                </Text>
                <View
                  className={cn('mt-xs h-0.5 rounded-pill', active ? 'bg-primary' : 'bg-transparent')}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
