import { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, CalendarClock, ChevronRight, Settings, Share2 } from '@/ui/icons';

import { useBookmarks } from '@/logic/hooks/useBookmarks';
import {
  useMe,
  usePublicProfile,
  useUserContributions,
  useUserLists,
  useUserRatings,
  useUserReviews,
  useUserTracking,
} from '@/logic/hooks/useProfile';
import { useRootStore } from '@/logic/store';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { Button } from '@/ui/components/primitives/Button';
import { Collage } from '@/ui/components/cover/Collage';
import { CoverCard } from '@/ui/components/cover/CoverCard';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { Skeleton, SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { RatingStars } from '@/ui/components/domain/RatingStars';
import { Screen } from '@/ui/components/layout/Screen';
import { Tabs } from '@/ui/components/primitives/Tabs';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface ProfileScreenProps {
  uid?: string;
}

const PROFILE_TABS = [
  { id: 'tracking', label: 'Tracking' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'ratings', label: 'Ratings' },
  { id: 'lists', label: 'Lists' },
  { id: 'contributions', label: 'Contributions' },
];

export function ProfileScreen({ uid }: ProfileScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const currentUid = useRootStore((state) => state.uid);
  const currentUsername = useRootStore((state) => state.username);
  const [activeTab, setActiveTab] = useState('tracking');

  const isMe = !uid || uid === currentUid;
  const effectiveUid = uid || currentUid || '';

  const { total: bookmarkTotal } = useBookmarks();
  const meQuery = useMe();
  const publicProfile = usePublicProfile(effectiveUid);
  const profile = publicProfile.profile;

  const displayName =
    profile?.username ?? (isMe ? meQuery.data?.username ?? currentUsername : null) ?? 'Unknown user';

  const contributionsCount = publicProfile.stats
    ? publicProfile.stats.seriesAdded +
      publicProfile.stats.editsApproved +
      publicProfile.stats.reviewsWritten +
      publicProfile.stats.ratingsGiven +
      publicProfile.stats.characterRatingsGiven +
      publicProfile.stats.characterReviewsWritten
    : 0;

  const trackingQuery = useUserTracking(effectiveUid, activeTab === 'tracking');
  const reviewsQuery = useUserReviews(effectiveUid, activeTab === 'reviews');
  const ratingsQuery = useUserRatings(effectiveUid, activeTab === 'ratings');
  const listsQuery = useUserLists(effectiveUid, activeTab === 'lists');
  const contributionsQuery = useUserContributions(effectiveUid, activeTab === 'contributions');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${displayName} on Pornhwa DB: https://pornhwadb.com/u/${effectiveUid}`,
      });
    } catch {
      // user dismissed the share sheet
    }
  };

  const renderLoadMore = (hasNextPage: boolean, fetchNextPage: () => void) =>
    hasNextPage ? (
      <Button
        label="Load more"
        variant="outline"
        size="sm"
        onPress={fetchNextPage}
        fullWidth
        className="mt-sm"
      />
    ) : null;

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={
          !isMe ? (
            <IconButton
              icon={ArrowLeft}
              accessibilityLabel="Back"
              onPress={() => router.back()}
            />
          ) : null
        }
        title={isMe ? 'Profile' : displayName}
        right={
          <>
            {isMe ? (
              <IconButton
                icon={Bookmark}
                accessibilityLabel={`Bookmarked chapters${bookmarkTotal > 0 ? ` (${bookmarkTotal})` : ''}`}
                badge={bookmarkTotal > 0 ? bookmarkTotal : undefined}
                onPress={() => router.push('/bookmarks')}
              />
            ) : null}
            <IconButton
              icon={Share2}
              accessibilityLabel="Share profile"
              onPress={handleShare}
            />
            {isMe ? (
              <IconButton
                icon={Settings}
                accessibilityLabel="Settings"
                onPress={() => router.push('/settings')}
              />
            ) : null}
          </>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-3xl">
        {publicProfile.isPending && !profile ? (
          <View className="items-center gap-md border-b border-border bg-card p-lg">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-sm h-20 w-full" />
          </View>
        ) : publicProfile.isError && !profile ? (
          <ErrorState
            title="Could not load profile"
            description="This profile is unavailable right now."
            onRetry={publicProfile.refetch}
          />
        ) : (
          <View className="items-center gap-md border-b border-border bg-card p-lg">
            <View className="rounded-full border-2 border-primary p-1">
              <Avatar uri={profile?.avatarImage} name={displayName} size={88} />
            </View>

            <View className="flex-row items-center gap-sm">
              <Text className="text-h1 font-inter-bold text-foreground">{displayName}</Text>
              {profile?.isEditor ? (
                <View className="rounded-full bg-primary-soft px-sm py-xs">
                  <Text className="text-caption font-inter-bold text-primary">Editor</Text>
                </View>
              ) : null}
            </View>

            {profile?.createdAt ? (
              <View className="flex-row items-center gap-xs">
                <CalendarClock size={14} color={colors.muted} />
                <Text className="text-caption text-muted">
                  Member since {new Date(profile.createdAt).getFullYear()}
                </Text>
              </View>
            ) : null}

            {profile?.bio ? (
              <Text className="text-center text-body leading-5 text-muted">
                {profile.bio}
              </Text>
            ) : null}

            <View className="mt-sm w-full flex-row items-center justify-around rounded-md border border-border bg-background py-md">
              <View className="items-center gap-xs">
                <Text className="text-h2 font-inter-bold text-foreground">
                  {profile?.followingCount ?? 0}
                </Text>
                <Text className="text-caption text-muted">Following</Text>
              </View>
              <View className="h-6 w-px bg-border" />
              <View className="items-center gap-xs">
                <Text className="text-h2 font-inter-bold text-foreground">
                  {profile?.followerCount ?? 0}
                </Text>
                <Text className="text-caption text-muted">Followers</Text>
              </View>
              <View className="h-6 w-px bg-border" />
              <View className="items-center gap-xs">
                <Text className="text-h2 font-inter-bold text-foreground">
                  {contributionsCount}
                </Text>
                <Text className="text-caption text-muted">Contributions</Text>
              </View>
            </View>

            {isMe ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View bookmarked chapters, ${bookmarkTotal} saved`}
                onPress={() => router.push('/bookmarks')}
                className="mt-sm w-full flex-row items-center justify-between rounded-md border border-border bg-card px-md py-sm active:bg-elevated"
              >
                <View className="flex-row items-center gap-sm">
                  <Bookmark size={18} color={colors.primary} fill={colors.primary} />
                  <Text className="font-inter-semibold text-body text-foreground">
                    Bookmarked Chapters
                  </Text>
                </View>
                <View className="flex-row items-center gap-xs">
                  <View className="rounded-full bg-primary-soft px-sm py-[2px]">
                    <Text className="font-inter-bold text-caption text-primary">
                      {bookmarkTotal}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={colors.muted} />
                </View>
              </Pressable>
            ) : null}
          </View>
        )}

        <View className="border-b border-border px-lg">
          <Tabs
            items={PROFILE_TABS.map((t) => ({ value: t.id, label: t.label }))}
            value={activeTab}
            onChange={setActiveTab}
          />
        </View>

        <View className="p-lg">
          {activeTab === 'tracking' && (
            <View className="gap-md">
              {trackingQuery.isPending && trackingQuery.entries.length === 0 ? (
                <>
                  <SkeletonSeriesRow />
                  <SkeletonSeriesRow />
                </>
              ) : trackingQuery.entries.length === 0 ? (
                <EmptyState
                  title="No tracked series"
                  description="No tracking records found for this user."
                />
              ) : (
                <>
                  <View className="flex-row flex-wrap gap-md">
                    {trackingQuery.entries.map((entry) => (
                      <View key={entry.series.id} className="w-[47%]">
                        <CoverCard
                          series={entry.series}
                          onPress={() => router.push(`/pornhwa/${entry.series.slug}`)}
                        />
                      </View>
                    ))}
                  </View>
                  {renderLoadMore(trackingQuery.hasNextPage, trackingQuery.fetchNextPage)}
                </>
              )}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View className="gap-md">
              {reviewsQuery.isPending && reviewsQuery.reviews.length === 0 ? (
                <>
                  <SkeletonSeriesRow />
                  <SkeletonSeriesRow />
                </>
              ) : reviewsQuery.reviews.length === 0 ? (
                <EmptyState
                  title="No reviews"
                  description="This user hasn't written any reviews yet."
                />
              ) : (
                <>
                  {reviewsQuery.reviews.map((rev) => (
                    <Pressable
                      key={rev.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Review of ${rev.title}`}
                      onPress={() => router.push(`/pornhwa/${rev.slug}`)}
                      className="gap-sm rounded-md border border-border bg-card p-md active:bg-elevated"
                    >
                      <View className="flex-row items-center justify-between gap-sm">
                        <Text
                          className="flex-1 text-body font-inter-semibold text-foreground"
                          numberOfLines={1}
                        >
                          {rev.title}
                        </Text>
                        {rev.rating ? <RatingStars rating={rev.rating} /> : null}
                      </View>
                      <Text className="text-body text-muted">{rev.reviewText}</Text>
                      {rev.createdAt ? (
                        <Text className="text-caption text-muted">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </Text>
                      ) : null}
                    </Pressable>
                  ))}
                  {renderLoadMore(reviewsQuery.hasNextPage, reviewsQuery.fetchNextPage)}
                </>
              )}
            </View>
          )}

          {activeTab === 'ratings' && (
            <View className="gap-md">
              {ratingsQuery.isPending && ratingsQuery.ratings.length === 0 ? (
                <>
                  <SkeletonSeriesRow />
                  <SkeletonSeriesRow />
                </>
              ) : ratingsQuery.ratings.length === 0 ? (
                <EmptyState title="No ratings" description="No series ratings found." />
              ) : (
                <>
                  {ratingsQuery.ratings.map((r) => (
                    <Pressable
                      key={r.pornhwaId}
                      accessibilityRole="button"
                      accessibilityLabel={r.title}
                      onPress={() => router.push(`/pornhwa/${r.slug}`)}
                      className="flex-row items-center justify-between gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
                    >
                      <Text
                        className="flex-1 text-body font-inter-semibold text-foreground"
                        numberOfLines={1}
                      >
                        {r.title}
                      </Text>
                      <RatingStars rating={r.rating} />
                    </Pressable>
                  ))}
                  {renderLoadMore(ratingsQuery.hasNextPage, ratingsQuery.fetchNextPage)}
                </>
              )}
            </View>
          )}

          {activeTab === 'lists' && (
            <View className="gap-md">
              {listsQuery.isPending && listsQuery.lists.length === 0 ? (
                <>
                  <SkeletonSeriesRow />
                  <SkeletonSeriesRow />
                </>
              ) : listsQuery.lists.length === 0 ? (
                <EmptyState
                  title="No lists"
                  description="No public lists created by this user."
                />
              ) : (
                <>
                  {listsQuery.lists.map((l) => (
                    <Pressable
                      key={l.slug}
                      accessibilityRole="button"
                      accessibilityLabel={l.title}
                      onPress={() => router.push(`/lists/${l.username ?? 'user'}/${l.slug}`)}
                      className="flex-row items-center gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
                    >
                      <Collage images={l.coverImages} size={64} />
                      <View className="flex-1 gap-xs">
                        <Text
                          className="text-body font-inter-semibold text-foreground"
                          numberOfLines={1}
                        >
                          {l.title}
                        </Text>
                        <Text className="text-caption text-muted">{l.itemCount} items</Text>
                      </View>
                    </Pressable>
                  ))}
                  {renderLoadMore(listsQuery.hasNextPage, listsQuery.fetchNextPage)}
                </>
              )}
            </View>
          )}

          {activeTab === 'contributions' && (
            <View className="gap-md">
              {contributionsQuery.isPending && contributionsQuery.contributions.length === 0 ? (
                <>
                  <SkeletonSeriesRow />
                  <SkeletonSeriesRow />
                </>
              ) : contributionsQuery.contributions.length === 0 ? (
                <EmptyState
                  title="No contributions"
                  description="No community contributions on record."
                />
              ) : (
                <>
                  {contributionsQuery.contributions.map((c) => (
                    <Pressable
                      key={c.eventId}
                      accessibilityRole="button"
                      accessibilityLabel={`${c.type} contribution to ${c.title}`}
                      onPress={() => router.push(`/pornhwa/${c.slug}`)}
                      className="flex-row items-center justify-between gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
                    >
                      <View className="flex-1 gap-xs">
                        <Text className="text-caption font-inter-semibold text-primary">
                          {c.type === 'edit' ? 'EDIT' : 'NEW SERIES'}
                        </Text>
                        <Text className="text-body font-inter-semibold text-foreground">
                          {c.title}
                        </Text>
                      </View>
                      {c.createdAt ? (
                        <Text className="text-caption text-muted">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </Text>
                      ) : null}
                    </Pressable>
                  ))}
                  {renderLoadMore(
                    contributionsQuery.hasNextPage,
                    contributionsQuery.fetchNextPage,
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
