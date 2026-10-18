import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Dices, Star, X } from '@/ui/icons';

import { useRandomSeries } from '@/logic/hooks/useRandomSeries';
import { useSearch } from '@/logic/hooks/useSearch';
import { useRootStore } from '@/logic/store';
import type { SearchCharacterResult } from '@/logic/usecases/resolveSearch';
import { formatRating } from '@/shared/lib/format';
import { remoteImage } from '@/shared/lib/images';
import type { Series } from '@/shared/types/models';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { Button } from '@/ui/components/primitives/Button';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { Input } from '@/ui/components/primitives/Input';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Screen } from '@/ui/components/layout/Screen';
import { Segmented } from '@/ui/components/primitives/Segmented';
import { SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

export function SearchScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const query = useRootStore((state) => state.searchQuery);
  const segment = useRootStore((state) => state.searchSegment);
  const recentSearches = useRootStore((state) => state.recentSearches);
  const setSearchQuery = useRootStore((state) => state.setSearchQuery);
  const setSearchSegment = useRootStore((state) => state.setSearchSegment);
  const pushRecentSearch = useRootStore((state) => state.pushRecentSearch);
  const removeRecentSearch = useRootStore((state) => state.removeRecentSearch);

  const [inputVal, setInputVal] = useState(query);
  const { surpriseMe, isPickingRandom } = useRandomSeries();

  const { items, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearch(
    query,
    segment,
    Boolean(query),
  );

  const handleSubmit = () => {
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim());
      pushRecentSearch(inputVal.trim());
    }
  };

  const handleClear = () => {
    setInputVal('');
    setSearchQuery('');
  };

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={
          <View className="flex-1 pr-sm">
            <Input
              placeholder="Search title, creator, or character..."
              value={inputVal}
              onChangeText={setInputVal}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
              trailing={
                inputVal ? (
                  <IconButton
                    icon={X}
                    accessibilityLabel="Clear search input"
                    onPress={handleClear}
                    size={16}
                  />
                ) : null
              }
            />
          </View>
        }
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={() => {
              handleClear();
              if (router.canGoBack()) {
                router.back();
              }
            }}
            className="px-sm py-xs active:opacity-70"
          >
            <Text className="text-body font-inter-medium text-foreground">Cancel</Text>
          </Pressable>
        }
      />

      <View className="border-b border-border px-lg py-sm">
        <Segmented
          options={[
            { label: 'Series', value: 'series' },
            { label: 'Characters', value: 'characters' },
          ]}
          value={segment}
          onChange={(val) => setSearchSegment(val as 'series' | 'characters')}
        />
      </View>

      {recentSearches.length > 0 && !query ? (
        <View className="border-b border-border py-sm">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-sm px-lg"
          >
            {recentSearches.map((term) => (
              <View
                key={term}
                className="flex-row items-center gap-xs rounded-full border border-border bg-card px-md py-xs"
              >
                <Pressable
                  onPress={() => {
                    setInputVal(term);
                    setSearchQuery(term);
                  }}
                >
                  <Text className="text-caption text-foreground">{term}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove recent search ${term}`}
                  onPress={() => removeRecentSearch(term)}
                  hitSlop={4}
                >
                  <X size={12} color={colors.muted} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {isPending && query ? (
        <View className="gap-md p-lg">
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
          <SkeletonSeriesRow />
        </View>
      ) : !query ? (
        <View className="flex-1 items-center justify-center p-xl gap-lg">
          <EmptyState
            title="Search Pornhwa DB"
            description="Type a manhwa title, creator, or character name to search."
          />
          <Button
            label="Can't decide? Surprise Me"
            icon={Dices}
            variant="outline"
            onPress={() => surpriseMe()}
            loading={isPickingRandom}
          />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl gap-lg">
          <EmptyState
            title="No results found"
            description={`No ${segment} matched "${query}". Try another search term.`}
          />
          <Button
            label="Try a Random Manhwa"
            icon={Dices}
            variant="outline"
            onPress={() => surpriseMe()}
            loading={isPickingRandom}
          />
        </View>
      ) : segment === 'series' ? (
        <FlashList
          data={items as Series[]}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const creator = item.authors[0] ?? item.artists[0] ?? null;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => router.push(`/pornhwa/${item.slug}`)}
                className="mb-md flex-row gap-md rounded-md border border-border bg-card p-sm active:opacity-75"
              >
                <Image
                  {...remoteImage(item.coverImage)}
                  contentFit="cover"
                  style={{ width: 64, height: 96, borderRadius: 8 }}
                />
                <View className="flex-1 justify-center gap-xs">
                  <Text className="text-h3 font-inter-semibold text-foreground" numberOfLines={2}>
                    {item.title}
                  </Text>
                  {creator ? (
                    <Text className="text-caption text-muted" numberOfLines={1}>
                      by {creator}
                    </Text>
                  ) : null}
                  <View className="flex-row items-center gap-xs">
                    <Star size={13} color={colors.primary} fill={colors.primary} />
                    <Text className="text-caption font-inter-semibold text-foreground">
                      {formatRating(item.averageRating)}
                    </Text>
                    <Text className="text-caption text-muted">({item.totalRatings})</Text>
                  </View>
                  {item.genreTags.length > 0 ? (
                    <View className="flex-row gap-xs">
                      {item.genreTags.slice(0, 2).map((t) => (
                        <View key={t} className="rounded-sm bg-elevated px-xs py-[2px]">
                          <Text className="text-[11px] text-muted">{t}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      ) : (
        <FlashList
          data={items as unknown as SearchCharacterResult[]}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.name}
              onPress={() => router.push(`/character/${item.id}`)}
              className="mb-md flex-row items-center gap-md rounded-md border border-border bg-card p-md active:opacity-75"
            >
              <Avatar uri={item.image} name={item.name} size={52} />
              <View className="flex-1 gap-xs">
                <Text className="text-h3 font-inter-semibold text-foreground">{item.name}</Text>
                {item.seriesTitle ? (
                  <Text className="text-caption text-muted" numberOfLines={1}>
                    from {item.seriesTitle}
                  </Text>
                ) : null}
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
