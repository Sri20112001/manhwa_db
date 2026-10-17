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
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { RankChip } from '@/ui/components/domain/RankChip';
import { Screen } from '@/ui/components/layout/Screen';
import { SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';
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
  const { stats, leaderboard, isLeaderboardPending } = useStats(currentPeriod.id);

  const handleCyclePeriod = () => {
    setPeriodIndex((prev) => (prev + 1) % PERIODS.length);
  };

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-xl p-lg pb-3xl">
        {/* 2x2 Stat Tiles Grid */}
        <View className="gap-md">
          <View className="flex-row gap-md">
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
          </View>
          <View className="flex-row gap-md">
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
          </View>
        </View>

        {/* Activity Trend Chart Area (Flat Rose) */}
        <View className="gap-md rounded-md border border-border bg-card p-lg">
          <Text className="text-h3 font-inter-bold text-foreground">Monthly Activity Trend</Text>
          <View className="h-32 flex-row items-end justify-between px-sm pt-md">
            {[42, 68, 55, 84, 96, 75, 110, 88, 95, 120, 105, 130].map((val, idx) => {
              const heightPct = Math.round((val / 130) * 100);
              return (
                <View key={idx} className="items-center gap-xs">
                  <View
                    className="w-4 rounded-t-sm bg-primary"
                    style={{ height: `${heightPct}%` }}
                  />
                  <Text className="text-[9px] text-muted">{idx + 1}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Leaderboard */}
        <View className="gap-md">
          <Text className="text-h2 font-inter-bold text-foreground">Top Contributors</Text>

          {isLeaderboardPending && leaderboard.length === 0 ? (
            <View className="gap-md">
              <SkeletonSeriesRow />
              <SkeletonSeriesRow />
            </View>
          ) : leaderboard.length === 0 ? (
            <EmptyState title="No leaderboard data" description="Leaderboard for this period is empty." />
          ) : (
            leaderboard.map((user) => (
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
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
