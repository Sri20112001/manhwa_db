import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, Dices, SlidersHorizontal } from '@/ui/icons';

import { useBrowse } from '@/logic/hooks/useBrowse';
import { useRandomSeries } from '@/logic/hooks/useRandomSeries';
import { useRootStore } from '@/logic/store';
import { CoverGrid } from '@/ui/components/cover/CoverGrid';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { Screen } from '@/ui/components/layout/Screen';
import { ScrollRow } from '@/ui/components/layout/ScrollRow';
import { Chip } from '@/ui/components/primitives/Chip';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Input } from '@/ui/components/primitives/Input';
import type { CatalogueSort, SeriesStatus } from '@/shared/types/filters';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

const STATUS_FILTERS: { label: string; value: SeriesStatus }[] = [
  { label: 'On Going', value: 'On Going' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Hiatus', value: 'Hiatus' },
];

const SORTS: { label: string; value: CatalogueSort }[] = [
  { label: 'Rating', value: 'average_rating' },
  { label: 'Total Ratings', value: 'total_ratings' },
  { label: 'Chapters', value: 'chapter_count' },
  { label: 'Updated', value: 'updated_at' },
  { label: 'Title', value: 'title' },
];

export function BrowseScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const searchParams = useLocalSearchParams<{ genre?: string }>();
  const filters = useRootStore((state) => state.browseFilters);
  const toggleStatus = useRootStore((state) => state.toggleStatus);
  const patchFilters = useRootStore((state) => state.patchFilters);
  const setSort = useRootStore((state) => state.setSort);
  const activeCount = useRootStore((state) => state.activeFilterCount());

  const [sortIndex, setSortIndex] = useState(0);
  const { surpriseMe, isPickingRandom } = useRandomSeries();

  useEffect(() => {
    if (searchParams.genre && !filters.tags.includes(searchParams.genre)) {
      patchFilters({ tags: [searchParams.genre] });
    }
  }, [searchParams.genre, filters.tags, patchFilters]);

  const {
    items,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useBrowse(filters);

  const handleNextSort = () => {
    const next = (sortIndex + 1) % SORTS.length;
    setSortIndex(next);
    const selected = SORTS[next]!;
    setSort(selected.value);
  };

  const handleToggleOrientation = (orient: 'yaoi' | 'yuri') => {
    if (filters.orientation === orient) {
      patchFilters({ orientation: 'any' });
    } else {
      patchFilters({ orientation: orient });
    }
  };

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={
          <View className="flex-1 pr-sm">
            <Pressable onPress={() => router.push('/(tabs)/search')}>
              <Input
                placeholder="Search title, creator, or character..."
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
          </View>
        }
        right={
          <View className="flex-row items-center gap-xs">
            <IconButton
              icon={Dices}
              accessibilityLabel="Pick random manhwa"
              onPress={() =>
                surpriseMe(
                  filters.orientation === 'yaoi' || filters.orientation === 'yuri'
                    ? filters.orientation
                    : undefined,
                )
              }
              loading={isPickingRandom}
              size={20}
            />
            <IconButton
              icon={SlidersHorizontal}
              accessibilityLabel={`Filters (${activeCount} active)`}
              variant={activeCount > 0 ? 'primary-soft' : 'plain'}
              onPress={() => router.push('/filters')}
            />
          </View>
        }
      />

      <View className="border-b border-border py-xs">
        <ScrollRow className="px-lg">
          {STATUS_FILTERS.map((s) => {
            const active = filters.status.includes(s.value);
            return (
              <Chip
                key={s.value}
                label={s.label}
                active={active}
                onPress={() => toggleStatus(s.value)}
              />
            );
          })}
          <Chip
            label="Yaoi"
            active={filters.orientation === 'yaoi'}
            onPress={() => handleToggleOrientation('yaoi')}
          />
          <Chip
            label="Yuri"
            active={filters.orientation === 'yuri'}
            onPress={() => handleToggleOrientation('yuri')}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Sort: ${SORTS[sortIndex]?.label}`}
            onPress={handleNextSort}
            className="flex-row items-center gap-xs rounded-full border border-border bg-card px-md py-xs"
          >
            <Text className="text-caption font-inter-medium text-foreground">
              {SORTS[sortIndex]?.label}
            </Text>
            <ChevronDown size={14} color={colors.muted} />
          </Pressable>
        </ScrollRow>
      </View>

      {isError && items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <ErrorState
            title="Could not load catalogue"
            description="Failed to retrieve catalogue series."
            onRetry={refetch}
          />
        </View>
      ) : (
        <CoverGrid
          items={items}
          onPressItem={(s) => router.push(`/pornhwa/${s.slug}`)}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          showSkeletons={isPending || isFetchingNextPage}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            !isPending ? (
              <View className="py-2xl">
                <EmptyState
                  title="No series found"
                  description="Try adjusting your status, tags, or orientation filters."
                />
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}
