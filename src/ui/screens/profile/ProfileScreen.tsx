import { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CalendarClock,
  MessageSquare,
  Settings,
  Share2,
  UserPlus,
} from '@/ui/icons';

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
import { Collage } from '@/ui/components/cover/Collage';
import { CoverCard } from '@/ui/components/cover/CoverCard';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
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
  const [isFollowing, setIsFollowing] = useState(false);

  const isMe = !uid || uid === currentUid;
  const effectiveUid = uid || currentUid || '';

  const meQuery = useMe();
  const publicProfile = usePublicProfile(effectiveUid);

  const profile = isMe
    ? {
        uid: meQuery.data?.uid ?? currentUid ?? 'user',
        username: meQuery.data?.username ?? currentUsername ?? 'My Account',
        avatarImage: null,
        bio: 'Manga and manhwa enthusiast on Pornhwa DB.',
        createdAt: '2026-01-01T00:00:00Z',
        isFollowing: false,
        followerCount: 14,
        followingCount: 32,
        contributionsCount: 8,
      }
    : publicProfile.profile;

  const trackingQuery = useUserTracking(effectiveUid, activeTab === 'tracking');
  const reviewsQuery = useUserReviews(effectiveUid, activeTab === 'reviews');
  const ratingsQuery = useUserRatings(effectiveUid, activeTab === 'ratings');
  const listsQuery = useUserLists(effectiveUid, activeTab === 'lists');
  const contributionsQuery = useUserContributions(effectiveUid, activeTab === 'contributions');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${profile?.username ?? 'Profile'} on Pornhwa DB: https://pornhwadb.com/u/${effectiveUid}`,
      });
    } catch {
      // ignore
    }
  };

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
        title={isMe ? 'Profile' : profile?.username}
        right={
          <>
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
        {/* Profile Card */}
        <View className="items-center gap-md border-b border-border bg-card p-lg">
          <View className="rounded-full border-2 border-primary p-1">
            <Avatar uri={profile?.avatarImage} name={profile?.username ?? 'User'} size={88} />
          </View>

          <Text className="text-h1 font-inter-bold text-foreground">{profile?.username}</Text>

          {profile?.createdAt ? (
            <View className="flex-row items-center gap-xs">
              <CalendarClock size={14} color={colors.muted} />
              <Text className="text-caption text-muted">
                Member since {new Date(profile.createdAt).getFullYear()}
              </Text>
            </View>
          ) : null}

          {profile?.bio ? (
            <Text className="text-center text-body leading-5 text-muted" numberOfLines={2}>
              {profile.bio}
            </Text>
          ) : null}

          {/* Stat Row */}
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
                {profile?.contributionsCount ?? 0}
              </Text>
              <Text className="text-caption text-muted">Contributions</Text>
            </View>
          </View>

          {/* Action Row */}
          {!isMe ? (
            <View className="mt-sm flex-row gap-sm">
              <IconButton
                icon={UserPlus}
                accessibilityLabel={isFollowing ? 'Unfollow' : 'Follow user'}
                variant={isFollowing ? 'primary' : 'surface'}
                onPress={() => setIsFollowing((v) => !v)}
              />
              <IconButton
                icon={MessageSquare}
                accessibilityLabel="Message user"
                variant="surface"
                onPress={() => {}}
              />
            </View>
          ) : null}
        </View>

        {/* Tab Bar */}
        <View className="border-b border-border px-lg">
          <Tabs
            items={PROFILE_TABS.map((t) => ({ value: t.id, label: t.label }))}
            value={activeTab}
            onChange={setActiveTab}
          />
        </View>

        {/* Tab Content */}
        <View className="p-lg">
          {activeTab === 'tracking' && (
            <View className="flex-row flex-wrap gap-md">
              {trackingQuery.entries.length === 0 && !trackingQuery.isPending ? (
                <EmptyState title="No tracked series" description="No tracking records found for this user." />
              ) : (
                trackingQuery.entries.map((entry) => (
                  <View key={entry.series.id} className="w-[47%]">
                    <CoverCard
                      series={entry.series}
                      onPress={() => router.push(`/pornhwa/${entry.series.slug}`)}
                    />
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View className="gap-md">
              {reviewsQuery.reviews.length === 0 && !reviewsQuery.isPending ? (
                <EmptyState title="No reviews" description="This user hasn't written any reviews yet." />
              ) : (
                reviewsQuery.reviews.map((rev) => (
                  <View
                    key={rev.id}
                    className="gap-sm rounded-md border border-border bg-card p-md"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-body font-inter-semibold text-foreground">
                        {rev.title}
                      </Text>
                      {rev.rating ? <RatingStars rating={rev.rating} /> : null}
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

          {activeTab === 'ratings' && (
            <View className="gap-md">
              {ratingsQuery.ratings.length === 0 && !ratingsQuery.isPending ? (
                <EmptyState title="No ratings" description="No series ratings found." />
              ) : (
                ratingsQuery.ratings.map((r) => (
                  <Pressable
                    key={r.pornhwaId}
                    accessibilityRole="button"
                    accessibilityLabel={r.title}
                    onPress={() => router.push(`/pornhwa/${r.slug}`)}
                    className="flex-row items-center justify-between rounded-md border border-border bg-card p-md active:bg-elevated"
                  >
                    <Text className="flex-1 text-body font-inter-semibold text-foreground" numberOfLines={1}>
                      {r.title}
                    </Text>
                    <RatingStars rating={r.rating} />
                  </Pressable>
                ))
              )}
            </View>
          )}

          {activeTab === 'lists' && (
            <View className="gap-md">
              {listsQuery.lists.length === 0 && !listsQuery.isPending ? (
                <EmptyState title="No lists" description="No public lists created by this user." />
              ) : (
                listsQuery.lists.map((l) => (
                  <Pressable
                    key={l.slug}
                    accessibilityRole="button"
                    accessibilityLabel={l.title}
                    onPress={() => router.push(`/lists/${l.username ?? 'user'}/${l.slug}`)}
                    className="flex-row items-center gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
                  >
                    <Collage images={l.coverImages} size={64} />
                    <View className="flex-1 gap-xs">
                      <Text className="text-body font-inter-semibold text-foreground" numberOfLines={1}>
                        {l.title}
                      </Text>
                      <Text className="text-caption text-muted">{l.itemCount} items</Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          )}

          {activeTab === 'contributions' && (
            <View className="gap-md">
              {contributionsQuery.contributions.length === 0 && !contributionsQuery.isPending ? (
                <EmptyState title="No contributions" description="No community contributions on record." />
              ) : (
                contributionsQuery.contributions.map((c) => (
                  <View
                    key={c.eventId}
                    className="flex-row items-center justify-between rounded-md border border-border bg-card p-md"
                  >
                    <View className="gap-xs">
                      <Text className="text-body font-inter-semibold text-foreground">{c.type}</Text>
                      <Text className="text-caption text-muted">{c.title}</Text>
                    </View>
                    {c.createdAt ? (
                      <Text className="text-[11px] text-muted">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </Text>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
