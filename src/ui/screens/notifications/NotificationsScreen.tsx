import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ArrowLeft, Check } from '@/ui/icons';

import { useActivity } from '@/logic/hooks/useActivity';
import { useRootStore } from '@/logic/store';
import { ActivityRow } from '@/ui/components/domain/ActivityRow';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Screen } from '@/ui/components/layout/Screen';
import { SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';

export function NotificationsScreen() {
  const router = useRouter();
  const readNotificationIds = useRootStore((state) => state.readNotificationIds);
  const markNotificationRead = useRootStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useRootStore((state) => state.markAllNotificationsRead);

  const { items, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    useActivity();

  const handleMarkAllRead = () => {
    markAllNotificationsRead(items.map((it) => String(it.id)));
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
        title="Notifications"
        right={
          items.length > 0 ? (
            <IconButton
              icon={Check}
              accessibilityLabel="Mark all as read"
              onPress={handleMarkAllRead}
            />
          ) : null
        }
      />

      {isPending && items.length === 0 ? (
        <View className="gap-md p-lg">
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
        </View>
      ) : isError && items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <ErrorState
            title="Could not load notifications"
            description="Failed to fetch updates."
            onRetry={refetch}
          />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <EmptyState
            title="All caught up"
            description="You have no unread updates or notifications."
          />
        </View>
      ) : (
        <FlashList
          data={items}
          keyExtractor={(item) => String(item.id)}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => {
            const isRead = readNotificationIds.includes(String(item.id));
            return (
              <View className={isRead ? 'opacity-60' : 'bg-primary-soft/10'}>
                <ActivityRow
                  item={item}
                  onPress={() => {
                    markNotificationRead(String(item.id));
                    if (item.target.kind === 'pornhwa') {
                      router.push(`/pornhwa/${item.target.slug}`);
                    } else if (item.target.kind === 'character') {
                      router.push(`/character/${item.target.id}`);
                    } else if (item.target.kind === 'list') {
                      router.push(`/lists/${item.actor.username}/${item.target.slug}`);
                    }
                  }}
                />
              </View>
            );
          }}
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
