import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';

import { cn } from '@/shared/lib/cn';
import { formatRating } from '@/shared/lib/format';
import { remoteImage } from '@/shared/lib/images';
import type { Series, SeriesReference } from '@/shared/types/models';
import { StatusChip } from '@/ui/components/domain/StatusChip';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface CoverCardProps {
  series: Series | SeriesReference;
  width?: number;
  onPress?: () => void;
  showTags?: boolean;
  className?: string;
}

export function CoverCard({ series, width, onPress, showTags = true, className }: CoverCardProps) {
  const colors = useThemeColors();
  const creator =
    'authors' in series && series.authors?.[0]
      ? series.authors[0]
      : 'artists' in series && series.artists?.[0]
        ? series.artists[0]
        : null;

  const status = 'status' in series ? series.status : null;
  const genreTags = 'genreTags' in series && Array.isArray(series.genreTags) ? series.genreTags : [];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={series.title}
      onPress={onPress}
      disabled={!onPress}
      style={width ? { width } : undefined}
      className={cn('gap-sm', className)}
    >
      <View className="overflow-hidden rounded-md border border-border bg-card">
        <Image
          {...remoteImage(series.coverImage)}
          contentFit="cover"
          style={{ aspectRatio: 2 / 3, width: '100%' }}
          accessibilityIgnoresInvertColors
        />
        {status ? (
          <View className="absolute left-sm top-sm">
            <StatusChip status={status} />
          </View>
        ) : null}
      </View>

      {'averageRating' in series && series.averageRating != null ? (
        <View className="flex-row items-center gap-xs">
          <Star size={13} strokeWidth={iconTokens.stroke} color={colors.primary} fill={colors.primary} />
          <Text className="text-caption font-inter-semibold text-foreground">
            {formatRating(series.averageRating)}
          </Text>
          {'totalRatings' in series && series.totalRatings != null ? (
            <Text className="text-caption text-muted">({series.totalRatings})</Text>
          ) : null}
        </View>
      ) : null}

      <Text className="text-h3 leading-5 text-foreground" numberOfLines={2}>
        {series.title}
      </Text>

      {creator ? (
        <Text className="text-caption text-muted" numberOfLines={1}>
          {creator}
        </Text>
      ) : null}

      {showTags && genreTags.length > 0 ? (
        <View className="flex-row gap-xs">
          {genreTags.slice(0, 2).map((tag: string) => (
            <View key={tag} className="rounded-sm bg-elevated px-sm py-[2px]">
              <Text className="text-[11px] text-muted">{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}
