import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface RowProps {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  className?: string;
}

export function Row({ title, subtitle, leading, trailing, onPress, showChevron, className }: RowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={title}
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'flex-row items-center gap-md px-lg py-md',
        onPress && 'active:bg-elevated',
        className,
      )}
    >
      {leading}
      <View className="flex-1">
        <Text className="text-body font-inter-semibold text-foreground" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-caption text-muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {showChevron ? (
        <ChevronRight size={iconTokens.size.inline} strokeWidth={iconTokens.stroke} color={colors.muted} />
      ) : null}
    </Pressable>
  );
}
