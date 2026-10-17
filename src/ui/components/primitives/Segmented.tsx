import { Pressable, ScrollView, Text, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  scrollable?: boolean;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  scrollable,
  className,
}: SegmentedProps<T>) {
  const content = (
    <View className={cn('flex-row gap-xs rounded-md bg-elevated p-xs', className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            className={cn(
              'min-w-[68px] items-center justify-center rounded-sm px-md py-sm',
              active ? 'bg-primary' : 'bg-transparent',
            )}
          >
            <Text
              className={cn(
                'text-caption font-inter-semibold',
                active ? 'text-on-primary' : 'text-muted',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pr-lg"
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}
