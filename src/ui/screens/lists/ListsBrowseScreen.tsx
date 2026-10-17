import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Heart, Layers, Lock, Plus, Search } from '@/ui/icons';

import { useLists, type ListFilter } from '@/logic/hooks/useLists';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { Chip } from '@/ui/components/primitives/Chip';
import { Collage } from '@/ui/components/cover/Collage';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Input } from '@/ui/components/primitives/Input';
import { Screen } from '@/ui/components/layout/Screen';
import { ScrollRow } from '@/ui/components/layout/ScrollRow';
import { SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

const FILTER_TABS: { id: ListFilter; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New' },
  { id: 'likes', label: 'Most liked' },
];

export function ListsBrowseScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [filter, setFilter] = useState<ListFilter>('trending');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { lists, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useLists(filter, search);

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        title="Lists"
        right={
          <>
            <IconButton
              icon={Search}
              accessibilityLabel="Search lists"
              onPress={() => setShowSearch((v) => !v)}
            />
            <IconButton
              icon={Plus}
              accessibilityLabel="Create custom list"
              onPress={() => router.push('/lists/new')}
            />
          </>
        }
      />

      {showSearch ? (
        <View className="border-b border-border p-md">
          <Input
            placeholder="Search custom lists..."
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>
      ) : null}

      <View className="border-b border-border py-xs">
        <ScrollRow className="px-lg">
          {FILTER_TABS.map((tab) => (
            <Chip
              key={tab.id}
              label={tab.label}
              active={filter === tab.id}
              onPress={() => setFilter(tab.id)}
            />
          ))}
        </ScrollRow>
      </View>

      {isPending && lists.length === 0 ? (
        <View className="gap-md p-lg">
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
        </View>
      ) : isError && lists.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <ErrorState
            title="Could not load lists"
            description="Failed to fetch public lists."
            onRetry={refetch}
          />
        </View>
      ) : lists.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <EmptyState
            title="No lists found"
            description="No custom lists found matching your criteria."
          />
        </View>
      ) : (
        <FlashList
          data={lists}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => router.push(`/lists/${item.username ?? 'user'}/${item.slug}`)}
              className="mb-md flex-row gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
            >
              <Collage images={item.coverImages} size={96} />
              <View className="flex-1 justify-center gap-xs">
                <View className="flex-row items-center gap-xs">
                  <Text className="flex-1 text-h3 font-inter-semibold text-foreground" numberOfLines={1}>
                    {item.title}
                  </Text>
                  {!item.isPublic ? <Lock size={14} color={colors.muted} /> : null}
                </View>

                {item.description ? (
                  <Text className="text-caption text-muted" numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}

                <View className="flex-row items-center justify-between pt-xs">
                  <View className="flex-row items-center gap-sm">
                    <View className="flex-row items-center gap-xs">
                      <Heart size={13} color={colors.primary} />
                      <Text className="text-[11px] text-muted">{item.likeCount}</Text>
                    </View>
                    <View className="flex-row items-center gap-xs">
                      <Layers size={13} color={colors.muted} />
                      <Text className="text-[11px] text-muted">{item.itemCount} items</Text>
                    </View>
                  </View>

                  {item.username ? (
                    <View className="flex-row items-center gap-xs">
                      <Avatar uri={item.avatarImage} name={item.username} size={20} />
                      <Text className="text-[11px] text-muted">{item.username}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
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
