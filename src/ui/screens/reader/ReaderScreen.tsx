import { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Heart, Play, Share2 } from '@/ui/icons';

import { useBookmarks, useChapterBookmark } from '@/logic/hooks/useBookmarks';
import { useChapters } from '@/logic/hooks/useChapters';
import { useFavorite, useTrackingMutations } from '@/logic/hooks/useTrackingMutations';
import { useSeries } from '@/logic/hooks/useSeries';
import { useRootStore } from '@/logic/store';
import { useSafeBack } from '@/shared/lib/navigation';
import type { Chapter } from '@/shared/types/models';
import { ChapterRow } from '@/ui/components/domain/ChapterRow';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Screen } from '@/ui/components/layout/Screen';
import { Segmented } from '@/ui/components/primitives/Segmented';
import { SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface SceneCardProps {
  chapter: Chapter;
  slug: string;
  pornhwaId?: number;
  seriesTitle: string;
  coverImage: string | null;
}

function SceneCard({
  chapter,
  slug,
  pornhwaId,
  seriesTitle,
  coverImage,
}: SceneCardProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const label = `Chapter ${chapter.chapterStart}`;

  const { isBookmarked, toggle: toggleBookmark, enabled: canBookmark } = useChapterBookmark({
    pornhwaId: pornhwaId || chapter.pornhwaId || 0,
    slug,
    seriesTitle,
    coverImage,
    chapterStart: chapter.chapterStart,
    chapterEnd: chapter.chapterEnd,
    chapterTitle: label,
    description: chapter.description,
    tags: chapter.tags,
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Scene Chapter ${chapter.chapterStart}`}
      onPress={() => router.push(`/read/${slug}/${chapter.chapterStart}`)}
      className="relative min-h-28 w-[31%] items-center justify-center rounded-md border border-border bg-card p-sm active:bg-elevated sm:w-[23%] md:w-[18%]"
    >
      {canBookmark && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? `Remove bookmark for ${label}` : `Bookmark ${label}`}
          hitSlop={6}
          onPress={(event) => {
            event.stopPropagation();
            toggleBookmark();
          }}
          className="absolute top-1 right-1 h-7 w-7 items-center justify-center rounded-full active:opacity-70"
        >
          <Bookmark
            size={14}
            strokeWidth={iconTokens.stroke}
            color={isBookmarked ? colors.primary : colors.muted}
            fill={isBookmarked ? colors.primary : 'transparent'}
          />
        </Pressable>
      )}

      <View className="rounded-sm bg-primary-soft px-sm py-xs">
        <Text className="text-caption font-inter-bold text-primary">
          Ch {chapter.chapterStart}
        </Text>
      </View>
      <Text className="mt-xs text-center text-caption text-muted" numberOfLines={2}>
        {chapter.description ?? `Scene ${chapter.chapterStart}`}
      </Text>
      {chapter.characters.length > 0 ? (
        <View className="mt-xs flex-row flex-wrap items-center justify-center gap-xs">
          {chapter.characters.slice(0, 3).map((character) => (
            <Avatar
              key={character.id}
              uri={character.image}
              name={character.name}
              size={16}
            />
          ))}
          {chapter.characters.length > 3 ? (
            <Text className="text-overline text-muted">
              +{chapter.characters.length - 3}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

interface ReaderScreenProps {
  slug: string;
}

export function ReaderScreen({ slug }: ReaderScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const { goBack } = useSafeBack(slug ? `/pornhwa/${slug}` : '/(tabs)');
  const pushToast = useRootStore((state) => state.pushToast);
  const lastChapter = useRootStore((state) => state.lastChapter[slug]);
  const [segment, setSegment] = useState<'chapters' | 'scenes'>('chapters');

  const { series } = useSeries(slug);
  const { chapters, isPending, isError, refetch } = useChapters(slug, series?.id ?? 0);
  const { isFavorited, setFavorited } = useFavorite(slug);
  const { favorite } = useTrackingMutations();
  const { total: bookmarkTotal } = useBookmarks();

  const handleToggleFavorite = () => {
    const next = !isFavorited;
    setFavorited(next);
    favorite(slug, next);
    pushToast(next ? 'Added to favorites' : 'Removed from favorites', 'success');
  };

  const handleShare = async () => {
    if (!series) return;
    try {
      await Share.share({
        message: `${series.title} on Pornhwa DB: https://pornhwadb.com/pornhwa/${series.slug}`,
      });
    } catch {
      // user dismissed the share sheet
    }
  };

  const continueChapter = lastChapter ?? chapters[0]?.chapterStart ?? 1;

  return (
    <Screen edges={['top']}>
      <GlassHeader
        left={
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back"
            onPress={goBack}
          />
        }
        title={series?.title ?? 'Chapters'}
        right={
          <>
            <IconButton
              icon={Heart}
              accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              onPress={handleToggleFavorite}
              variant={isFavorited ? 'primary' : 'plain'}
              fill={isFavorited ? colors.primary : undefined}
            />
            <IconButton
              icon={Bookmark}
              accessibilityLabel={`Bookmarked chapters${bookmarkTotal > 0 ? ` (${bookmarkTotal})` : ''}`}
              badge={bookmarkTotal > 0 ? bookmarkTotal : undefined}
              onPress={() => router.push('/bookmarks')}
            />
            <IconButton
              icon={Share2}
              accessibilityLabel="Share series"
              onPress={handleShare}
              disabled={!series}
            />
          </>
        }
      />

      <View className="border-b border-border px-lg py-sm">
        <Segmented
          options={[
            { label: `Chapters (${chapters.length})`, value: 'chapters' },
            { label: `Scenes (${chapters.length})`, value: 'scenes' },
          ]}
          value={segment}
          onChange={(val) => setSegment(val as 'chapters' | 'scenes')}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-3xl">
        {isPending ? (
          <View className="gap-md p-lg">
            <SkeletonSeriesRow />
            <SkeletonSeriesRow />
            <SkeletonSeriesRow />
          </View>
        ) : isError ? (
          <View className="items-center justify-center p-xl">
            <ErrorState
              title="Could not load chapters"
              description="Failed to load chapter list."
              onRetry={refetch}
            />
          </View>
        ) : chapters.length === 0 ? (
          <View className="py-2xl">
            <EmptyState
              title="No chapters available"
              description="No chapters or scenes listed for this manhwa."
            />
          </View>
        ) : segment === 'chapters' ? (
          <View>
            {chapters.map((ch) => (
              <ChapterRow
                key={ch.id}
                chapter={ch}
                pornhwaId={series?.id}
                slug={slug}
                seriesTitle={series?.title ?? ''}
                coverImage={series?.coverImage ?? null}
                showCharacters={true}
              />
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-sm p-lg">
            {chapters.map((ch) => (
              <SceneCard
                key={ch.id}
                chapter={ch}
                slug={slug}
                pornhwaId={series?.id}
                seriesTitle={series?.title ?? ''}
                coverImage={series?.coverImage ?? null}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button: Continue Reading */}
      {chapters.length > 0 ? (
        <View className="absolute bottom-6 right-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Continue reading Chapter ${continueChapter}`}
            onPress={() => router.push(`/read/${slug}/${continueChapter}`)}
            className="flex-row items-center gap-sm rounded-full bg-primary px-lg py-md shadow-lg active:opacity-80"
          >
            <Play size={18} color={colors.onPrimary} fill={colors.onPrimary} />
            <Text className="text-body font-inter-semibold text-on-primary">
              Read Ch. {continueChapter}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}
