import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BarChart3,
  Bell,
  BookOpen,
  Dices,
  Image,
  Layers,
  Search,
  Shuffle,
  Star,
  Users,
} from '@/ui/icons';

import { useBrowseCharacters } from '@/logic/hooks/useBrowseCharacters';
import { useDiscover } from '@/logic/hooks/useDiscover';
import { useRandomSeries } from '@/logic/hooks/useRandomSeries';
import { LogoMark } from '@/ui/components/brand/LogoMark';
import { CharacterGrid } from '@/ui/components/cover/CharacterGrid';
import { CoverCard } from '@/ui/components/cover/CoverCard';
import { StatTile } from '@/ui/components/domain/StatTile';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { SkeletonCoverCard } from '@/ui/components/feedback/Skeleton';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { Screen } from '@/ui/components/layout/Screen';
import { ScrollRow } from '@/ui/components/layout/ScrollRow';
import { SectionHeader } from '@/ui/components/layout/SectionHeader';
import { Chip } from '@/ui/components/primitives/Chip';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Segmented } from '@/ui/components/primitives/Segmented';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

const GENRES = ['All', 'Action', 'Harem', 'Romance', 'Fantasy', 'Drama', 'College'];

export function DiscoverScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const {
    sections,
    random,
    isRandomPending,
    shuffleRandom,
    stats,
    isStatsPending,
    isError,
    refetch,
  } = useDiscover();
  const { surpriseMe, isPickingRandom } = useRandomSeries();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [segment, setSegment] = useState<'series' | 'characters'>('series');

  const {
    items: characters,
    isPending: isCharactersPending,
    isError: isCharactersError,
    refetch: refetchCharacters,
    fetchNextPage: fetchNextCharactersPage,
    hasNextPage: hasNextCharactersPage,
    isFetchingNextPage: isFetchingNextCharactersPage,
    isRefetching: isRefetchingCharacters,
  } = useBrowseCharacters(segment === 'characters');

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
              icon={Image}
              accessibilityLabel="Gallery"
              onPress={() => router.push('/gallery')}
              size={20}
            />
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

      <View className="border-b border-border px-lg py-sm">
        <Segmented
          options={[
            { label: 'Series', value: 'series' },
            { label: 'Characters', value: 'characters' },
          ]}
          value={segment}
          onChange={setSegment}
        />
      </View>

      {segment === 'characters' ? (
        isCharactersError && characters.length === 0 ? (
          <View className="flex-1 items-center justify-center p-xl">
            <ErrorState
              title="Could not load characters"
              description="Failed to retrieve character profiles."
              onRetry={refetchCharacters}
            />
          </View>
        ) : (
          <CharacterGrid
            items={characters}
            onPressItem={(c) => router.push(`/character/${c.id}`)}
            onEndReached={() => {
              if (hasNextCharactersPage && !isFetchingNextCharactersPage) {
                fetchNextCharactersPage();
              }
            }}
            showSkeletons={isCharactersPending || isFetchingNextCharactersPage}
            refreshing={isRefetchingCharacters}
            onRefresh={refetchCharacters}
            ListEmptyComponent={
              !isCharactersPending ? (
                <View className="py-2xl">
                  <EmptyState
                    title="No characters found"
                    description="Character profiles will appear here once they are documented."
                  />
                </View>
              ) : null
            }
          />
        )
      ) : (
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
      )}
    </Screen>
  );
}
