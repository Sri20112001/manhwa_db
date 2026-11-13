import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark } from '@/ui/icons';

import { chapterRange } from '@/shared/lib/format';
import type { ChapterBookmark } from '@/shared/types/models';
import { CoverThumb } from '@/ui/components/cover/CoverThumb';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface BookmarkRowProps {
  bookmark: ChapterBookmark;
  onRemove: () => void;
}

function formatBookmarkedAt(timestamp: number): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BookmarkRow({ bookmark, onRemove }: BookmarkRowProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const label = `Chapter ${chapterRange(bookmark.chapterStart, bookmark.chapterEnd)}`;
  const secondary =
    bookmark.chapterTitle && bookmark.chapterTitle !== label
      ? bookmark.chapterTitle
      : bookmark.description;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${bookmark.seriesTitle}, ${label}`}
      onPress={() => router.push(`/read/${bookmark.slug}/${bookmark.chapterStart}`)}
      className="mx-lg mb-md flex-row gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View series ${bookmark.seriesTitle}`}
        onPress={(event) => {
          event.stopPropagation();
          router.push(`/pornhwa/${bookmark.slug}`);
        }}
      >
        <CoverThumb uri={bookmark.coverImage} width={64} height={92} />
      </Pressable>

      <View className="flex-1 justify-center gap-xs">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View series ${bookmark.seriesTitle}`}
          onPress={(event) => {
            event.stopPropagation();
            router.push(`/pornhwa/${bookmark.slug}`);
          }}
        >
          <Text numberOfLines={1} className="font-inter-semibold text-body text-foreground active:text-primary">
            {bookmark.seriesTitle}
          </Text>
        </Pressable>

        <View className="flex-row items-center gap-xs">
          <View className="rounded-sm bg-primary-soft px-xs py-[1px]">
            <Text className="font-inter-bold text-overline text-primary">{label}</Text>
          </View>
          {secondary ? (
            <Text numberOfLines={1} className="flex-1 text-caption text-muted">
              {secondary}
            </Text>
          ) : null}
        </View>

        {bookmark.tags.length > 0 ? (
          <View className="flex-row flex-wrap gap-xs">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <View
                key={tag}
                className="rounded-full border border-border/70 bg-elevated/70 px-2 py-0.5"
              >
                <Text className="font-inter-medium text-overline text-muted">{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text className="text-overline text-muted">
          Bookmarked {formatBookmarkedAt(bookmark.bookmarkedAt)}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove bookmark for ${bookmark.seriesTitle} ${label}`}
        hitSlop={8}
        onPress={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        className="h-9 w-9 items-center justify-center self-start rounded-full active:opacity-70"
      >
        <Bookmark
          size={iconTokens.size.inline}
          strokeWidth={iconTokens.stroke}
          color={colors.primary}
          fill={colors.primary}
        />
      </Pressable>
    </Pressable>
  );
}
