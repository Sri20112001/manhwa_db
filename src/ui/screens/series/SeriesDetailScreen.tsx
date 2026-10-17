import { useState } from 'react';
import { Linking, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  Heart,
  List,
  PlusSquare,
  Share2,
  Star,
} from '@/ui/icons';

import {
  useSeries,
  useSeriesCharacters,
  useSeriesReviews,
  useSimilarSeries,
} from '@/logic/hooks/useSeries';
import { useChapters } from '@/logic/hooks/useChapters';
import { useTrackingEntry, useTrackingMutations } from '@/logic/hooks/useTrackingMutations';
import { formatRating } from '@/shared/lib/format';
import { remoteImage } from '@/shared/lib/images';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { Button } from '@/ui/components/primitives/Button';
import { ChapterRow } from '@/ui/components/domain/ChapterRow';
import { Chip } from '@/ui/components/primitives/Chip';
import { CoverCard } from '@/ui/components/cover/CoverCard';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { RatingStars } from '@/ui/components/domain/RatingStars';
import { Screen } from '@/ui/components/layout/Screen';
import { SkeletonSeriesDetail } from '@/ui/components/feedback/Skeleton';
import { StatusChip } from '@/ui/components/domain/StatusChip';
import { Tabs } from '@/ui/components/primitives/Tabs';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import type { TrackingStatus } from '@/shared/constants/status';

interface SeriesDetailScreenProps {
  slug: string;
}

const DETAIL_TABS = [
  { id: 'info', label: 'Info' },
  { id: 'characters', label: 'Characters' },
  { id: 'chapters', label: 'Chapters' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'similar', label: 'Similar' },
];

const TRACKING_OPTIONS: { label: string; value: TrackingStatus }[] = [
  { label: 'Reading', value: 'reading' },
  { label: 'Plan to read', value: 'plan_to_read' },
  { label: 'Completed', value: 'completed' },
  { label: 'On hold', value: 'on_hold' },
  { label: 'Dropped', value: 'dropped' },
  { label: 'Re-reading', value: 're_reading' },
];

export function SeriesDetailScreen({ slug }: SeriesDetailScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState('info');
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const { series, isPending, isError, refetch } = useSeries(slug);
  const { entry } = useTrackingEntry(slug);
  const { setStatus, favorite, incrementChapter } = useTrackingMutations();

  const charactersQuery = useSeriesCharacters(slug, activeTab === 'characters');
  const chaptersQuery = useChapters(slug, series?.id ?? 0);
  const reviewsQuery = useSeriesReviews(slug, activeTab === 'reviews');
  const similarQuery = useSimilarSeries(slug, activeTab === 'similar');

  if (isPending && !series) {
    return (
      <Screen edges={['top']}>
        <SkeletonSeriesDetail />
      </Screen>
    );
  }

  if (isError && !series) {
    return (
      <Screen edges={['top']} className="items-center justify-center p-xl">
        <ErrorState
          title="Could not load series"
          description="Failed to retrieve manhwa details."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  if (!series) return null;

  const currentStatus = entry?.status ?? null;
  const chaptersCount = series.totalChapters ?? series.chapterCount;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${series.title} on Pornhwa DB: https://pornhwadb.com/pornhwa/${series.slug}`,
      });
    } catch {
      // ignore
    }
  };

  const handleSetStatus = (s: TrackingStatus) => {
    setStatus(slug, s);
    setShowStatusMenu(false);
  };

  const handleToggleFavorite = () => {
    const next = !isFavorited;
    setIsFavorited(next);
    favorite(slug, next);
  };

  return (
    <Screen edges={['top']}>
      {/* Floating Header */}
      <View className="absolute left-0 right-0 top-0 z-20 flex-row items-center justify-between p-md">
        <IconButton
          icon={ArrowLeft}
          accessibilityLabel="Back"
          onPress={() => router.back()}
          variant="surface"
        />
        <View className="flex-row items-center gap-xs">
          <IconButton
            icon={Share2}
            accessibilityLabel="Share series"
            onPress={handleShare}
            variant="surface"
          />
          <IconButton
            icon={Bookmark}
            accessibilityLabel={currentStatus ? 'Tracked in library' : 'Bookmark series'}
            onPress={() => setShowStatusMenu((v) => !v)}
            variant={currentStatus ? 'primary-soft' : 'surface'}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-3xl">
        {/* Backdrop and Hero */}
        <View className="relative h-72 w-full overflow-hidden bg-surface">
          <Image
            {...remoteImage(series.coverImage)}
            contentFit="cover"
            blurRadius={18}
            style={{ width: '100%', height: '100%', opacity: 0.35 }}
          />
          <View className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          {/* Sharp Cover Thumb + Info */}
          <View className="absolute bottom-md left-lg right-lg flex-row items-end gap-md">
            <Image
              {...remoteImage(series.coverImage)}
              contentFit="cover"
              style={{ width: 100, height: 150, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}
            />
            <View className="flex-1 gap-xs">
              <Text className="text-h1 font-inter-bold text-foreground" numberOfLines={2}>
                {series.title}
              </Text>
              <View className="flex-row flex-wrap items-center gap-xs">
                {series.status ? <StatusChip status={series.status} /> : null}
                <Text className="text-caption text-muted">
                  {series.releaseYear ? `${series.releaseYear} · ` : ''}
                  {chaptersCount} chapters
                </Text>
              </View>
              <View className="flex-row items-center gap-xs">
                <Star size={14} color={colors.primary} fill={colors.primary} />
                <Text className="text-caption font-inter-semibold text-foreground">
                  {formatRating(series.averageRating)}
                </Text>
                <Text className="text-caption text-muted">({series.totalRatings})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Row */}
        <View className="mt-md flex-row items-center justify-around border-y border-border px-lg py-sm">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Track status"
            onPress={() => setShowStatusMenu((v) => !v)}
            className="flex-row items-center gap-xs rounded-full border border-border bg-card px-md py-xs active:bg-elevated"
          >
            <List size={16} color={currentStatus ? colors.primary : colors.foreground} />
            <Text className="text-caption font-inter-semibold text-foreground">
              {currentStatus ? currentStatus.replace('_', ' ') : 'Status'}
            </Text>
          </Pressable>

          <IconButton
            icon={PlusSquare}
            accessibilityLabel="Increment chapter read"
            onPress={() => incrementChapter(slug)}
            variant="surface"
          />

          <IconButton
            icon={Heart}
            accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            onPress={handleToggleFavorite}
            variant={isFavorited ? 'primary' : 'surface'}
          />

          <IconButton
            icon={Star}
            accessibilityLabel="Rate and review"
            onPress={() => router.push(`/review/${slug}`)}
            variant="surface"
          />
        </View>

        {/* Status Selection Sheet */}
        {showStatusMenu ? (
          <View className="mx-lg my-md rounded-md border border-border bg-card p-md">
            <Text className="mb-sm text-caption font-inter-semibold text-muted">TRACKING STATUS</Text>
            <View className="flex-row flex-wrap gap-sm">
              {TRACKING_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  active={currentStatus === opt.value}
                  onPress={() => handleSetStatus(opt.value)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* Tabs Bar */}
        <View className="mt-md border-b border-border px-lg">
          <Tabs
            items={DETAIL_TABS.map((t) => ({ value: t.id, label: t.label }))}
            value={activeTab}
            onChange={setActiveTab}
          />
        </View>

        {/* Tab Content */}
        <View className="p-lg">
          {activeTab === 'info' && (
            <View className="gap-xl">
              {series.description ? (
                <View className="gap-xs">
                  <Text className="text-h3 font-inter-bold text-foreground">Synopsis</Text>
                  <Text
                    className="text-body leading-6 text-muted"
                    numberOfLines={showFullSynopsis ? undefined : 3}
                  >
                    {series.description}
                  </Text>
                  {series.description.length > 150 ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showFullSynopsis ? 'Read less' : 'Read more'}
                      onPress={() => setShowFullSynopsis((v) => !v)}
                      className="py-xs active:opacity-70"
                    >
                      <Text className="text-caption font-inter-semibold text-primary">
                        {showFullSynopsis ? 'Show less' : 'Read more'}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}

              {series.creators.length > 0 ? (
                <View className="gap-xs">
                  <Text className="text-h3 font-inter-bold text-foreground">Creators</Text>
                  <View className="flex-row flex-wrap gap-sm">
                    {series.creators.map((c) => (
                      <View
                        key={c.id}
                        className="rounded-md border border-border bg-card px-md py-xs"
                      >
                        <Text className="text-body font-inter-medium text-foreground">
                          {c.canonicalName}
                        </Text>
                        <Text className="text-[11px] text-muted">{c.role}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {series.genreTags.length > 0 ? (
                <View className="gap-xs">
                  <Text className="text-h3 font-inter-bold text-foreground">Tags</Text>
                  <View className="flex-row flex-wrap gap-xs">
                    {series.genreTags.map((t) => (
                      <Chip key={t} label={t} tone="soft" />
                    ))}
                  </View>
                </View>
              ) : null}

              {series.externalLinks.length > 0 ? (
                <View className="gap-xs">
                  <Text className="text-h3 font-inter-bold text-foreground">Links</Text>
                  <View className="gap-sm">
                    {series.externalLinks.map((link) => (
                      <Pressable
                        key={link.url}
                        accessibilityRole="link"
                        accessibilityLabel={link.siteName}
                        onPress={() => void Linking.openURL(link.url)}
                        className="flex-row items-center justify-between rounded-md border border-border bg-card px-md py-sm active:bg-elevated"
                      >
                        <Text className="text-body text-foreground">{link.siteName}</Text>
                        <ExternalLink size={16} color={colors.muted} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          )}

          {activeTab === 'characters' && (
            <View className="gap-md">
              {charactersQuery.items.length === 0 && !charactersQuery.isPending ? (
                <EmptyState title="No characters" description="No character profiles documented for this series." />
              ) : (
                charactersQuery.items.map((char) => (
                  <Pressable
                    key={char.id}
                    accessibilityRole="button"
                    accessibilityLabel={char.name}
                    onPress={() => router.push(`/character/${char.id}`)}
                    className="flex-row items-center gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
                  >
                    <Avatar uri={char.image} name={char.name} size={48} />
                    <View className="flex-1 gap-xs">
                      <Text className="text-h3 font-inter-semibold text-foreground">{char.name}</Text>
                      {char.role ? (
                        <Text className="text-caption text-primary">{char.role}</Text>
                      ) : null}
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          )}

          {activeTab === 'chapters' && (
            <View>
              {chaptersQuery.chapters.length === 0 && !chaptersQuery.isPending ? (
                <EmptyState title="No chapters" description="No chapters found for this series." />
              ) : (
                chaptersQuery.chapters.map((ch) => (
                  <ChapterRow
                    key={ch.id}
                    chapter={ch}
                    onPress={() => router.push(`/reader/${slug}`)}
                  />
                ))
              )}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View className="gap-md">
              <Button
                label="Write a review"
                onPress={() => router.push(`/review/${slug}`)}
                variant="outline"
                fullWidth
              />
              {reviewsQuery.items.length === 0 && !reviewsQuery.isPending ? (
                <EmptyState title="No reviews yet" description="Be the first to review this series." />
              ) : (
                reviewsQuery.items.map((rev) => (
                  <View
                    key={rev.id}
                    className="gap-sm rounded-md border border-border bg-card p-md"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-body font-inter-semibold text-foreground">
                        {rev.userDisplayName}
                      </Text>
                      {rev.userRating ? <RatingStars rating={rev.userRating} /> : null}
                    </View>
                    <Text className="text-body text-muted">{rev.reviewText}</Text>
                    {rev.createdAt ? (
                      <Text className="text-[11px] text-muted">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </Text>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'similar' && (
            <View className="flex-row flex-wrap gap-md">
              {similarQuery.items.length === 0 && !similarQuery.isPending ? (
                <EmptyState title="No similar series" description="Could not find similar recommendations." />
              ) : (
                similarQuery.items.map((sim) => (
                  <View key={sim.id} className="w-[47%]">
                    <CoverCard series={sim} onPress={() => router.push(`/pornhwa/${sim.slug}`)} />
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="border-t border-border bg-card p-lg">
        <Button
          label={currentStatus ? `Tracking (${currentStatus.replace('_', ' ')})` : 'Add to library'}
          icon={Bookmark}
          onPress={() => {
            if (!currentStatus) {
              setStatus(slug, 'reading');
            } else {
              setShowStatusMenu((v) => !v);
            }
          }}
          fullWidth
        />
      </View>
    </Screen>
  );
}
