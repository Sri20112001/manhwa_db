import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ArrowLeft, Filter } from '@/ui/icons';

import { useActivity } from '@/logic/hooks/useActivity';
import { ActivityRow } from '@/ui/components/domain/ActivityRow';
import { Chip } from '@/ui/components/primitives/Chip';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Screen } from '@/ui/components/layout/Screen';
import { ScrollRow } from '@/ui/components/layout/ScrollRow';
import { SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';

const ACTIVITY_TYPES = [
  { id: '', label: 'All' },
  { id: 'review_posted', label: 'Reviews' },
  { id: 'rating_set', label: 'Ratings' },
  { id: 'tracking_status_changed', label: 'Tracking' },
  { id: 'list_created', label: 'Lists' },
];

export function ActivityScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { items, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    useActivity(selectedType || undefined);

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
        title="Activity"
        right={
          <IconButton
            icon={Filter}
            accessibilityLabel="Filter activity"
            onPress={() => setShowFilters((v) => !v)}
            variant={showFilters ? 'primary-soft' : 'plain'}
          />
        }
      />

      {showFilters ? (
        <View className="border-b border-border py-xs">
          <ScrollRow className="px-lg">
            {ACTIVITY_TYPES.map((t) => (
              <Chip
                key={t.id}
                label={t.label}
                active={selectedType === t.id}
                onPress={() => setSelectedType(t.id)}
              />
            ))}
          </ScrollRow>
        </View>
      ) : null}

      {isPending && items.length === 0 ? (
        <View className="gap-md p-lg">
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
        </View>
      ) : isError && items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <ErrorState
            title="Could not load activity"
            description="Failed to fetch global activity feed."
            onRetry={refetch}
          />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <EmptyState
            title="No activity yet"
            description="Community updates and activities will appear here."
          />
        </View>
      ) : (
        <FlashList
          data={items}
          keyExtractor={(item) => String(item.id)}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <ActivityRow
              item={item}
              onPress={() => {
                if (item.target.kind === 'pornhwa') {
                  router.push(`/pornhwa/${item.target.slug}`);
                } else if (item.target.kind === 'character') {
                  router.push(`/character/${item.target.id}`);
                } else if (item.target.kind === 'list') {
                  router.push(`/lists/${item.actor.username}/${item.target.slug}`);
                }
              }}
            />
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
