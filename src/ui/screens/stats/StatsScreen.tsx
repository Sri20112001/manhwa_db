import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  Star,
  Users,
} from '@/ui/icons';

import { useStats, type StatsPeriod } from '@/logic/hooks/useStats';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { Button } from '@/ui/components/primitives/Button';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { RankChip } from '@/ui/components/domain/RankChip';
import { Screen } from '@/ui/components/layout/Screen';
import { Skeleton, SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';
import { StatTile } from '@/ui/components/domain/StatTile';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

const PERIODS: { id: StatsPeriod; label: string }[] = [
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'year', label: 'This year' },
  { id: 'all', label: 'All time' },
];

export function StatsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [periodIndex, setPeriodIndex] = useState(0);

  const currentPeriod = PERIODS[periodIndex]!;
  const {
    stats,
    isStatsPending,
    isStatsError,
    leaderboard,
    isLeaderboardPending,
    isLeaderboardError,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useStats(currentPeriod.id);

  const handleCyclePeriod = () => {
    setPeriodIndex((prev) => (prev + 1) % PERIODS.length);
  };

  const tagRows = stats
    ? [
        { label: 'Genre tags', value: stats.totalTags.genre },
        { label: 'Character tags', value: stats.totalTags.character },
        { label: 'Chapter tags', value: stats.totalTags.chapter },
      ]
    : [];
  const maxTagCount = Math.max(1, ...tagRows.map((row) => row.value));

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back"
            onPress={() => router.back()}
          />
        }
        title="Stats"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Filter period: ${currentPeriod.label}`}
            onPress={handleCyclePeriod}
            className="flex-row items-center gap-xs rounded-full border border-border bg-card px-md py-xs active:bg-elevated"
          >
            <Calendar size={14} color={colors.primary} />
            <Text className="text-caption font-inter-semibold text-foreground">
              {currentPeriod.label}
            </Text>
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-xl p-lg pb-3xl"
      >
        {isStatsError && !stats ? (
          <ErrorState
            title="Could not load statistics"
            description="The catalogue statistics are unavailable right now."
            onRetry={refetch}
          />
        ) : (
          <View className="gap-md">
            <View className="flex-row gap-md">
              {isStatsPending && !stats ? (
                <>
                  <Skeleton className="h-28 flex-1" />
                  <Skeleton className="h-28 flex-1" />
                </>
              ) : (
                <>
                  <StatTile
                    icon={BookOpen}
                    value={stats?.totalPornhwa ?? 0}
                    caption="Manhwa Series"
                  />
                  <StatTile
                    icon={Users}
                    value={stats?.totalCharacters ?? 0}
                    caption="Characters"
                  />
                </>
              )}
            </View>
            <View className="flex-row gap-md">
              {isStatsPending && !stats ? (
                <>
                  <Skeleton className="h-28 flex-1" />
                  <Skeleton className="h-28 flex-1" />
                </>
              ) : (
                <>
                  <StatTile
                    icon={Star}
                    value={stats?.totalRatings ?? 0}
                    caption="User Ratings"
                  />
                  <StatTile
                    icon={Layers}
                    value={stats?.totalReviews ?? 0}
                    caption="Reviews Written"
                  />
                </>
              )}
            </View>
          </View>
        )}

        {stats ? (
          <View className="gap-md rounded-md border border-border bg-card p-lg">
            <View className="gap-xs">
              <Text className="text-h3 font-inter-bold text-foreground">Tag Coverage</Text>
              <Text className="text-caption text-muted">
                Tagged entities indexed across the catalogue.
              </Text>
            </View>
            <View className="gap-md">
              {tagRows.map((row) => (
                <View key={row.label} className="gap-xs">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-caption text-muted">{row.label}</Text>
                    <Text className="text-caption font-inter-semibold text-foreground">
                      {row.value.toLocaleString()}
                    </Text>
                  </View>
                  <View className="h-2 overflow-hidden rounded-full bg-elevated">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((row.value / maxTagCount) * 100)}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View className="gap-md">
          <Text className="text-h2 font-inter-bold text-foreground">Top Contributors</Text>

          {isLeaderboardPending && leaderboard.length === 0 ? (
            <View className="gap-md">
              <SkeletonSeriesRow />
              <SkeletonSeriesRow />
            </View>
          ) : isLeaderboardError && leaderboard.length === 0 ? (
            <ErrorState
              title="Could not load leaderboard"
              description="The contributor leaderboard is unavailable right now."
              onRetry={refetch}
            />
          ) : leaderboard.length === 0 ? (
            <EmptyState
              title="No leaderboard data"
              description="Leaderboard for this period is empty."
            />
          ) : (
            <>
              {leaderboard.map((user) => (
                <Pressable
                  key={user.uid}
                  accessibilityRole="button"
                  accessibilityLabel={`${user.username}, rank ${user.rank}`}
                  onPress={() => router.push(`/u/${user.uid}`)}
                  className="flex-row items-center gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
                >
                  <RankChip rank={user.rank} />
                  <Avatar uri={user.avatarImage} name={user.username} size={36} />
                  <View className="flex-1">
                    <Text className="text-body font-inter-semibold text-foreground">
                      {user.username}
                    </Text>
                    <Text className="text-caption text-muted">
                      {user.contributions} contributions
                    </Text>
                  </View>
                  <Text className="text-caption font-inter-bold text-primary">
                    {user.value != null ? `${user.value} pts` : ''}
                  </Text>
                </Pressable>
              ))}
              {hasNextPage ? (
                <Button
                  label="Load more"
                  variant="outline"
                  size="sm"
                  onPress={fetchNextPage}
                  fullWidth
                />
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
