import { Pressable, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { formatRating } from '@/shared/lib/format';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface RatingStarsProps {
  value?: number | null;
  rating?: number | null;
  count?: number;
  size?: number;
  onRate?: (value: number) => void;
  className?: string;
}

export function RatingStars({ value, rating, count, size = 16, onRate, className }: RatingStarsProps) {
  const colors = useThemeColors();
  const effectiveVal = value !== undefined ? value : rating ?? null;
  const rounded = effectiveVal == null ? 0 : Math.round(effectiveVal * 2) / 2;

  return (
    <View className={cn('flex-row items-center gap-md', className)}>
      <View className="flex-row items-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((step) => {
          const filled = rounded >= step;
          const half = !filled && rounded >= step - 0.5;
          return (
            <Pressable
              key={step}
              accessibilityRole={onRate ? 'button' : undefined}
              accessibilityLabel={`${step} star${step > 1 ? 's' : ''}`}
              disabled={!onRate}
              hitSlop={4}
              onPress={() => onRate?.(step)}
            >
              <Star
                size={size}
                strokeWidth={1.75}
                color={filled || half ? colors.primary : colors.muted}
                fill={filled ? colors.primary : 'transparent'}
                opacity={half ? 0.6 : 1}
              />
            </Pressable>
          );
        })}
      </View>
      {value != null ? (
        <Text className="text-caption font-inter-semibold text-foreground">{formatRating(value)}</Text>
      ) : null}
      {count != null ? <Text className="text-caption text-muted">({count})</Text> : null}
    </View>
  );
}
