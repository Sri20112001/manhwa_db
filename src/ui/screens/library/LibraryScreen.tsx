import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import {
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  Search,
} from '@/ui/icons';

import { useLibrary, useLibraryCounts } from '@/logic/hooks/useLibrary';
import { useTrackingMutations } from '@/logic/hooks/useTrackingMutations';
import { useRootStore } from '@/logic/store';
import type { LibrarySort, LibraryStatusTab } from '@/shared/types/filters';
import { CoverCard } from '@/ui/components/cover/CoverCard';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Screen } from '@/ui/components/layout/Screen';
import { SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';
import { TrackingRow } from '@/ui/components/domain/TrackingRow';

const STATUS_TABS: { id: LibraryStatusTab; label: string }[] = [
  { id: 'reading', label: 'Reading' },
  { id: 'plan_to_read', label: 'Plan' },
  { id: 'completed', label: 'Completed' },
  { id: 'on_hold', label: 'On Hold' },
  { id: 'dropped', label: 'Dropped' },
  { id: 're_reading', label: 'Re-reading' },
];

const SORTS: { label: string; value: LibrarySort }[] = [
  { label: 'Updated', value: 'updated' },
  { label: 'Title', value: 'title' },
  { label: 'Priority', value: 'priority' },
  { label: 'Rating', value: 'rating' },
];

export function LibraryScreen() {
  const router = useRouter();
  const activeStatusTab = useRootStore((state) => state.activeStatusTab);
  const librarySort = useRootStore((state) => state.librarySort);
  const libraryViewMode = useRootStore((state) => state.libraryViewMode);
  const setActiveStatusTab = useRootStore((state) => state.setActiveStatusTab);
  const setLibrarySort = useRootStore((state) => state.setLibrarySort);
  const setLibraryViewMode = useRootStore((state) => state.setLibraryViewMode);

  const [sortIndex, setSortIndex] = useState(0);

  const {
    entries,
    isPending,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useLibrary(activeStatusTab, librarySort);

  const { counts } = useLibraryCounts();
  const { incrementChapter } = useTrackingMutations();

  const handleCycleSort = () => {
    const next = (sortIndex + 1) % SORTS.length;
    setSortIndex(next);
    const selected = SORTS[next]!;
    setLibrarySort(selected.value);
  };

  const handleToggleView = () => {
    setLibraryViewMode(libraryViewMode === 'list' ? 'grid' : 'list');
  };

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        title="Library"
        right={
          <>
            <IconButton
              icon={Search}
              accessibilityLabel="Search library"
              onPress={() => router.push('/(tabs)/search')}
            />
            <IconButton
              icon={ArrowUpDown}
              accessibilityLabel={`Sort by ${SORTS[sortIndex]?.label}`}
              onPress={handleCycleSort}
            />
            <IconButton
              icon={libraryViewMode === 'list' ? LayoutGrid : ListIcon}
              accessibilityLabel={`Switch to ${libraryViewMode === 'list' ? 'grid' : 'list'} view`}
              onPress={handleToggleView}
            />
          </>
        }
      />

      {/* Horizontal Status Tabs */}
      <View className="border-b border-border">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-md px-lg py-sm"
        >
          {STATUS_TABS.map((tab) => {
            const active = activeStatusTab === tab.id;
            const count = counts ? counts[tab.id as keyof typeof counts] : undefined;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                accessibilityLabel={`${tab.label}${count != null ? ` (${count})` : ''}`}
                onPress={() => setActiveStatusTab(tab.id)}
                className="flex-row items-center gap-xs py-xs"
              >
                <Text
                  className={`text-body font-inter-semibold ${
                    active ? 'text-primary' : 'text-muted'
                  }`}
                >
                  {tab.label}
                </Text>
                {count != null && count > 0 ? (
                  <View
                    className={`rounded-full px-xs py-[1px] ${
                      active ? 'bg-primary-soft' : 'bg-elevated'
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-inter-bold ${
                        active ? 'text-primary' : 'text-muted'
                      }`}
                    >
                      {count}
                    </Text>
                  </View>
                ) : null}
                {active ? (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      {isPending && entries.length === 0 ? (
        <View className="gap-md p-lg">
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
        </View>
      ) : isError && entries.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <ErrorState
            title="Could not load library"
            description="Failed to fetch your reading tracking."
            onRetry={refetch}
          />
        </View>
      ) : entries.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <EmptyState
            title="No tracked manhwa"
            description="Manhwa you track will appear here under this status."
          />
        </View>
      ) : libraryViewMode === 'list' ? (
        <FlashList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <TrackingRow
              entry={item}
              onPress={() => router.push(`/pornhwa/${item.series.slug}`)}
              onIncrement={() => incrementChapter(item.series.slug)}
              onRate={() => router.push(`/review/${item.series.slug}`)}
            />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      ) : (
        <FlashList
          data={entries}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ padding: 8 }}
          renderItem={({ item }) => (
            <View className="flex-1 p-xs">
              <CoverCard
                series={item.series}
                onPress={() => router.push(`/pornhwa/${item.series.slug}`)}
              />
            </View>
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      )}
    </Screen>
  );
}
