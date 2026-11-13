import { useCallback, useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import {
  buildReaderChapterUrl,
  type ReaderChapterPage,
} from '@/api/endpoints/reader';
import { useReaderChapter } from '@/logic/hooks/useReaderChapter';
import { useChapterBookmark } from '@/logic/hooks/useBookmarks';
import { useSeries } from '@/logic/hooks/useSeries';
import { useSafeBack } from '@/shared/lib/navigation';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { Spinner } from '@/ui/components/feedback/Spinner';
import { Button } from '@/ui/components/primitives/Button';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight, ExternalLink } from '@/ui/icons';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface ChapterReaderScreenProps {
  slug: string;
  chapter: string;
}

export function ChapterReaderScreen({ slug, chapter }: ChapterReaderScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { goBack } = useSafeBack(slug ? `/reader/${slug}` : '/(tabs)');

  const [showControls, setShowControls] = useState(true);

  const { series } = useSeries(slug);
  const { chapterDetail, isPending, isError, error, refetch } = useReaderChapter(
    slug,
    chapter,
  );

  const {
    isBookmarked,
    toggle: toggleBookmark,
    enabled: canBookmark,
  } = useChapterBookmark({
    pornhwaId: chapterDetail?.series.pornhwaId || series?.id || 0,
    slug,
    seriesTitle: chapterDetail?.series.title || series?.title || '',
    coverImage: chapterDetail?.series.cover || series?.coverImage || null,
    chapterStart: chapterDetail?.number ?? Number(chapter),
    chapterTitle: chapterDetail?.title ?? null,
  });

  const toggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  const handleOpenWeb = useCallback(() => {
    const url = buildReaderChapterUrl(slug, chapter);
    void Linking.openURL(url);
  }, [slug, chapter]);

  const handleNavPrevious = useCallback(() => {
    if (chapterDetail?.previous) {
      router.replace(`/read/${slug}/${chapterDetail.previous.number}`);
    }
  }, [chapterDetail, router, slug]);

  const handleNavNext = useCallback(() => {
    if (chapterDetail?.next) {
      router.replace(`/read/${slug}/${chapterDetail.next.number}`);
    }
  }, [chapterDetail, router, slug]);

  const renderPage = useCallback(
    ({ item }: { item: ReaderChapterPage }) => {
      // Calculate aspect ratio height to prevent layout shift
      const pageHeight =
        item.width > 0 && item.height > 0
          ? Math.round((item.height / item.width) * windowWidth)
          : Math.round(windowWidth * 1.5);

      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Page ${item.ordinal}, tap to toggle controls`}
          onPress={toggleControls}
          className="bg-background"
          style={{ width: windowWidth, height: pageHeight }}
        >
          <Image
            source={{ uri: item.url }}
            placeholder={item.placeholder ? { uri: item.placeholder } : undefined}
            contentFit="fill"
            style={{ width: windowWidth, height: pageHeight }}
            transition={150}
            cachePolicy="memory-disk"
            accessibilityLabel={`Page ${item.ordinal}`}
            accessibilityIgnoresInvertColors
          />
        </Pressable>
      );
    },
    [toggleControls, windowWidth],
  );

  const renderFooter = useCallback(() => {
    if (!chapterDetail) return null;
    return (
      <View className="items-center justify-center gap-md border-t border-border/40 bg-card px-lg py-3xl">
        <Text className="text-h3 font-inter-bold text-foreground">
          End of {chapterDetail.title}
        </Text>
        <Text className="text-center text-caption text-muted">
          {chapterDetail.series.title}
        </Text>

        <View className="mt-md w-full max-w-xs gap-sm">
          {chapterDetail.next ? (
            <Button
              label={`Next: ${chapterDetail.next.title}`}
              variant="primary"
              trailingIcon={ChevronRight}
              fullWidth
              onPress={handleNavNext}
            />
          ) : (
            <Text className="text-center text-caption font-inter-medium text-muted">
              You are caught up to the latest chapter!
            </Text>
          )}

          <Button
            label={isBookmarked ? 'Remove bookmark' : 'Bookmark chapter'}
            variant={isBookmarked ? 'outline' : 'secondary'}
            icon={Bookmark}
            fullWidth
            onPress={toggleBookmark}
          />

          <Button
            label="Back to Chapter List"
            variant="outline"
            fullWidth
            onPress={goBack}
          />

          <Button
            label="Open on PornhwaDB Reader"
            variant="ghost"
            icon={ExternalLink}
            fullWidth
            onPress={handleOpenWeb}
          />
        </View>
      </View>
    );
  }, [chapterDetail, goBack, handleNavNext, handleOpenWeb, isBookmarked, toggleBookmark]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" hidden={!showControls} />

      {isPending ? (
        <View className="flex-1 items-center justify-center gap-md p-xl">
          <Spinner size="large" />
          <Text className="text-body font-inter-medium text-muted">
            Loading Chapter {chapter}...
          </Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-xl">
          <ErrorState
            title={`Could not load Chapter ${chapter}`}
            description={
              error?.message ??
              'The chapter could not be retrieved from PornhwaDB Reader. It may not have been published yet or is unavailable.'
            }
            onRetry={refetch}
          />
          <View className="mt-lg w-full max-w-xs gap-sm">
            <Button
              label="Read on PornhwaDB Reader (Web)"
              variant="primary"
              icon={ExternalLink}
              fullWidth
              onPress={handleOpenWeb}
            />
            <Button
              label="Back to Series"
              variant="outline"
              fullWidth
              onPress={goBack}
            />
          </View>
        </View>
      ) : (
        <FlatList
          data={chapterDetail?.pages ?? []}
          keyExtractor={(item) => String(item.ordinal)}
          renderItem={renderPage}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          initialNumToRender={3}
          maxToRenderPerBatch={4}
          windowSize={7}
          removeClippedSubviews={false}
        />
      )}

      {/* Floating Top Header Bar */}
      {showControls && (
        <View
          style={{ paddingTop: Math.max(insets.top, 16) }}
          className="absolute inset-x-0 top-0 z-50 flex-row items-center justify-between border-b border-border/30 bg-background/90 px-md pb-sm backdrop-blur-md"
        >
          <View className="flex-1 flex-row items-center gap-sm">
            <IconButton
              icon={ArrowLeft}
              accessibilityLabel="Back"
              onPress={goBack}
            />
            <View className="flex-1">
              <Text
                className="text-body font-inter-semibold text-foreground"
                numberOfLines={1}
              >
                {chapterDetail?.title ?? `Chapter ${chapter}`}
              </Text>
              <Text className="text-caption text-muted" numberOfLines={1}>
                {chapterDetail?.series?.title ?? slug}
              </Text>
            </View>
          </View>

          <IconButton
            icon={Bookmark}
            accessibilityLabel={isBookmarked ? 'Remove chapter bookmark' : 'Bookmark chapter'}
            onPress={toggleBookmark}
            disabled={!canBookmark}
            variant={isBookmarked ? 'primary-soft' : 'plain'}
            fill={isBookmarked ? colors.primary : undefined}
          />
          <IconButton
            icon={ExternalLink}
            accessibilityLabel="Open on web"
            onPress={handleOpenWeb}
          />
        </View>
      )}

      {/* Floating Bottom Navigation Bar */}
      {showControls && !isPending && !isError && (
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
          className="absolute inset-x-0 bottom-0 z-50 flex-row items-center justify-between border-t border-border/30 bg-background/90 px-lg pt-sm backdrop-blur-md"
        >
          <Button
            label="Prev"
            size="sm"
            variant="outline"
            icon={ChevronLeft}
            disabled={!chapterDetail?.previous}
            onPress={handleNavPrevious}
          />

          <View className="items-center">
            <Text className="text-caption font-inter-bold text-foreground">
              {chapterDetail?.title ?? `Ch. ${chapter}`}
            </Text>
            <Text className="text-overline text-muted">
              {chapterDetail?.pages?.length ?? 0} pages
            </Text>
          </View>

          <Button
            label="Next"
            size="sm"
            variant="outline"
            trailingIcon={ChevronRight}
            disabled={!chapterDetail?.next}
            onPress={handleNavNext}
          />
        </View>
      )}
    </View>
  );
}
