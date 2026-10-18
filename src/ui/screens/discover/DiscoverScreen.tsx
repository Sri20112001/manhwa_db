import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BarChart3, Bell, BookOpen, Dices, Layers, Search, Shuffle, Star, Users } from '@/ui/icons';

import { useDiscover } from '@/logic/hooks/useDiscover';
import { useRandomSeries } from '@/logic/hooks/useRandomSeries';
import { LogoMark } from '@/ui/components/brand/LogoMark';
import { CoverCard } from '@/ui/components/cover/CoverCard';
import { StatTile } from '@/ui/components/domain/StatTile';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { SkeletonCoverCard } from '@/ui/components/feedback/Skeleton';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { Screen } from '@/ui/components/layout/Screen';
import { ScrollRow } from '@/ui/components/layout/ScrollRow';
import { SectionHeader } from '@/ui/components/layout/SectionHeader';
import { Chip } from '@/ui/components/primitives/Chip';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

const GENRES = ['All', 'Action', 'Harem', 'Romance', 'Fantasy', 'Drama', 'College'];

export function DiscoverScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { sections, random, isRandomPending, shuffleRandom, stats, isStatsPending, isError, refetch } =
    useDiscover();
  const { surpriseMe, isPickingRandom } = useRandomSeries();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    refetch();
    shuffleRandom();
    setRefreshing(false);
  };

  const handleGenrePress = (genre: string) => {
    setSelectedGenre(genre);
    if (genre !== 'All') {
      router.push({
        pathname: '/(tabs)/browse',
        params: { genre },
      });
    }
  };

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={<LogoMark size={28} />}
        right={
          <>
            <IconButton
              icon={Dices}
              accessibilityLabel="Surprise Me (Pick a random manhwa)"
              onPress={() => surpriseMe()}
              loading={isPickingRandom}
              size={20}
            />
            <IconButton
              icon={Search}
              accessibilityLabel="Search"
              onPress={() => router.push('/(tabs)/search')}
            />
            <IconButton
              icon={Bell}
              accessibilityLabel="Notifications"
              onPress={() => router.push('/notifications')}
            />
          </>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-2xl"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-md px-lg py-md"
        >
          {GENRES.map((genre) => (
            <Chip
              key={genre}
              label={genre}
              active={selectedGenre === genre}
              onPress={() => handleGenrePress(genre)}
            />
          ))}
        </ScrollView>

        {isError && sections.every((s) => s.data.length === 0) ? (
          <View className="px-lg py-xl">
            <ErrorState
              title="Unable to load discover"
              description="Could not fetch catalogue feeds. Check your network connection."
              onRetry={handleRefresh}
            />
          </View>
        ) : null}

        {sections.map((section) => (
          <View key={section.key} className="mt-lg">
            <SectionHeader
              title={section.title}
              onPress={() => router.push('/(tabs)/browse')}
              accessibilityLabel={`View all ${section.title}`}
            />
            {section.isPending && section.data.length === 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-md px-lg"
              >
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCoverCard key={i} />
                ))}
              </ScrollView>
            ) : (
              <ScrollRow>
                {section.data.map((series) => (
                  <CoverCard
                    key={series.id}
                    series={series}
                    width={140}
                    onPress={() => router.push(`/pornhwa/${series.slug}`)}
                  />
                ))}
              </ScrollRow>
            )}
          </View>
        ))}

        <View className="mt-lg">
          <SectionHeader
            title="Random picks"
            right={
              <IconButton
                icon={Shuffle}
                accessibilityLabel="Shuffle random picks"
                onPress={shuffleRandom}
                size={18}
              />
            }
          />
          {isRandomPending && random.length === 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-md px-lg"
            >
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCoverCard key={i} />
              ))}
            </ScrollView>
          ) : (
            <ScrollRow>
              {random.map((series) => (
                <CoverCard
                  key={series.id}
                  series={series}
                  width={140}
                  onPress={() => router.push(`/pornhwa/${series.slug}`)}
                />
              ))}
            </ScrollRow>
          )}
        </View>

        {/* Database Statistics */}
        <View className="mt-xl px-lg">
          <SectionHeader
            title="Database Statistics"
            right={
              <IconButton
                icon={BarChart3}
                accessibilityLabel="View full stats and leaderboards"
                onPress={() => router.push('/stats')}
                size={18}
              />
            }
          />
          <View className="mt-sm gap-md">
            <View className="flex-row gap-md">
              <StatTile
                icon={BookOpen}
                value={stats?.totalPornhwa ?? (isStatsPending ? '...' : 0)}
                caption="Manhwa Series"
              />
              <StatTile
                icon={Users}
                value={stats?.totalCharacters ?? (isStatsPending ? '...' : 0)}
                caption="Characters"
              />
            </View>
            <View className="flex-row gap-md">
              <StatTile
                icon={Layers}
                value={stats?.totalChapters ?? (isStatsPending ? '...' : 0)}
                caption="Indexed Chapters"
              />
              <StatTile
                icon={Star}
                value={stats?.totalRatings ?? (isStatsPending ? '...' : 0)}
                caption="Ratings"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
