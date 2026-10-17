import { Pressable, Text, View } from 'react-native';
import { Flag, MoreVertical, Plus, Star } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { progressLabel, progressRatio } from '@/shared/lib/format';
import { TRACKING_STATUS_LABEL } from '@/shared/constants/status';
import type { TrackingEntry } from '@/shared/types/models';
import { CoverThumb } from '@/ui/components/cover/CoverThumb';
import { ProgressBar } from '@/ui/components/domain/ProgressBar';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface TrackingRowProps {
  entry: TrackingEntry;
  onPress?: () => void;
  onIncrement?: () => void;
  onRate?: () => void;
  onMenu?: () => void;
}

export function TrackingRow({ entry, onPress, onIncrement, onRate, onMenu }: TrackingRowProps) {
  const colors = useThemeColors();

  const rightActions = () => (
    <View className="flex-row items-center gap-sm bg-elevated px-md">
      <IconButton
        icon={Plus}
        accessibilityLabel={`Add one chapter to ${entry.series.title}`}
        onPress={onIncrement}
        variant="primary-soft"
      />
      <IconButton
        icon={Star}
        accessibilityLabel={`Rate ${entry.series.title}`}
        onPress={onRate}
        variant="surface"
        size={20}
      />
    </View>
  );

  return (
    <Swipeable renderRightActions={rightActions} overshootRight={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={entry.series.title}
        onPress={onPress}
        disabled={!onPress}
        className="flex-row items-center gap-md border-b border-border bg-background px-lg py-md active:bg-card"
      >
        <CoverThumb uri={entry.series.coverImage} width={64} height={96} />
        <View className="flex-1 gap-sm">
          <Text className="text-h3 leading-5 text-foreground" numberOfLines={2}>
            {entry.series.title}
          </Text>
          <ProgressBar
            ratio={progressRatio(entry.currentChapter, entry.series.totalChapters)}
            className="mt-xs"
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-caption text-primary">
              {progressLabel(entry.currentChapter, entry.series.totalChapters)}
            </Text>
            <Text className="text-caption text-muted">{TRACKING_STATUS_LABEL[entry.status]}</Text>
          </View>
        </View>
        <View className="gap-xs">
          {entry.priority != null ? (
            <Flag size={16} strokeWidth={iconTokens.stroke} color={colors.primary} />
          ) : null}
          <IconButton
            icon={MoreVertical}
            accessibilityLabel={`Options for ${entry.series.title}`}
            onPress={onMenu}
            size={18}
          />
        </View>
      </Pressable>
    </Swipeable>
  );
}
