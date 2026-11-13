import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ArrowLeft, Bookmark, RotateCcw, Search, SlidersHorizontal, X } from '@/ui/icons';

import { useBookmarks } from '@/logic/hooks/useBookmarks';
import { useSafeBack } from '@/shared/lib/navigation';
import {
  BOOKMARK_SORT_LABEL,
  DEFAULT_BOOKMARK_FILTERS,
  type BookmarkFilters,
  type BookmarkSort,
} from '@/shared/types/filters';
import { BookmarkRow } from '@/ui/components/domain/BookmarkRow';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { Screen } from '@/ui/components/layout/Screen';
import { Button } from '@/ui/components/primitives/Button';
import { Chip } from '@/ui/components/primitives/Chip';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Input } from '@/ui/components/primitives/Input';
import { Sheet } from '@/ui/components/primitives/Sheet';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

const SORT_OPTIONS: BookmarkSort[] = ['recent', 'oldest', 'series', 'chapter_asc', 'chapter_desc'];

const BOOKMARK_SORT_SHORT_LABEL: Record<BookmarkSort, string> = {
  recent: 'Recent',
  oldest: 'Oldest',
  series: 'Series (A–Z)',
  chapter_asc: 'Ch. Low→High',
  chapter_desc: 'Ch. High→Low',
};

function toggleDraftValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function BookmarksScreen() {
  const colors = useThemeColors();
  const { height: windowHeight } = useWindowDimensions();
  const { goBack } = useSafeBack('/(tabs)/library');
  const {
    visibleBookmarks,
    total,
    seriesOptions,
    tagOptions,
    sort,
    filters,
    activeFilterCount,
    setSort,
    patchFilters,
    toggleSeriesFilter,
    toggleTagFilter,
    resetFilters,
    removeBookmark,
  } = useBookmarks();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftSort, setDraftSort] = useState<BookmarkSort>(sort);
  const [draftFilters, setDraftFilters] = useState<BookmarkFilters>(filters);

  const seriesTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of seriesOptions) {
      map.set(opt.slug, opt.title);
    }
    return map;
  }, [seriesOptions]);

  const hasActiveFilters = activeFilterCount > 0;

  const openSheet = () => {
    setDraftSort(sort);
    setDraftFilters({
      query: filters.query,
      series: [...filters.series],
      tags: [...filters.tags],
    });
    setSheetOpen(true);
  };

  const applySheet = () => {
    patchFilters(draftFilters);
    setSort(draftSort);
    setSheetOpen(false);
  };

  const handleReset = () => {
    setDraftFilters({ ...DEFAULT_BOOKMARK_FILTERS });
    setDraftSort('recent');
  };

  return (
    <Screen edges={['top']}>
      <GlassHeader
        left={<IconButton icon={ArrowLeft} accessibilityLabel="Back" onPress={goBack} />}
        title="Bookmarks"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Sort and filter bookmarks${
              activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''
            }`}
            onPress={openSheet}
            className="flex-row items-center gap-xs rounded-full border border-border bg-card px-md py-xs active:bg-elevated"
          >
            <SlidersHorizontal
              size={16}
              strokeWidth={iconTokens.stroke}
              color={activeFilterCount > 0 ? colors.primary : colors.foreground}
            />
            <Text
              className={`font-inter-semibold text-caption ${
                activeFilterCount > 0 ? 'text-primary' : 'text-foreground'
              }`}
            >
              Sort & Filter
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Text>
          </Pressable>
        }
      />

      {/* Search Input Bar */}
      <View className="border-b border-border px-lg py-sm">
        <Input
          leadingIcon={Search}
          value={filters.query}
          onChangeText={(query) => patchFilters({ query })}
          placeholder="Search series, chapters, tags…"
          accessibilityLabel="Search bookmarked chapters"
          autoCorrect={false}
          returnKeyType="search"
          trailing={
            filters.query.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search text"
                hitSlop={8}
                onPress={() => patchFilters({ query: '' })}
              >
                <X size={16} strokeWidth={iconTokens.stroke} color={colors.muted} />
              </Pressable>
            ) : null
          }
        />
      </View>

      {/* Quick Sort Options Row */}
      <View className="border-b border-border/40 py-xs">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row items-center gap-xs px-lg"
        >
          <Text className="mr-xs text-overline font-inter-semibold text-muted">SORT:</Text>
          {SORT_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={BOOKMARK_SORT_SHORT_LABEL[option]}
              active={sort === option}
              onPress={() => setSort(option)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Active Filters Row (if any active filters) */}
      {hasActiveFilters && (
        <View className="border-b border-border/40 py-xs bg-card/40">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex-row items-center gap-xs px-lg"
          >
            <Text className="mr-xs text-overline font-inter-semibold text-muted">FILTERS:</Text>

            {filters.query.trim().length > 0 ? (
              <Chip
                label={`"${filters.query.trim()}"`}
                tone="primary"
                onRemove={() => patchFilters({ query: '' })}
              />
            ) : null}

            {filters.series.map((slug) => (
              <Chip
                key={slug}
                label={seriesTitleMap.get(slug) ?? slug}
                tone="primary"
                onRemove={() => toggleSeriesFilter(slug)}
              />
            ))}

            {filters.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                tone="primary"
                onRemove={() => toggleTagFilter(tag)}
              />
            ))}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset all filters"
              hitSlop={8}
              onPress={resetFilters}
              className="ml-xs rounded-full px-2 py-1 active:opacity-70"
            >
              <Text className="text-caption font-inter-medium text-primary">Clear all</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}

      {/* Results Header Summary */}
      <View className="flex-row items-center justify-between px-lg py-sm">
        <Text className="text-caption text-muted">
          {visibleBookmarks.length} of {total} chapter{total === 1 ? '' : 's'}
        </Text>
        <Text className="font-inter-medium text-caption text-muted">
          {BOOKMARK_SORT_LABEL[sort]}
        </Text>
      </View>

      <FlashList
        data={visibleBookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookmarkRow bookmark={item} onRemove={() => removeBookmark(item)} />
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          total === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No bookmarked chapters"
              description="Tap the bookmark icon on any chapter or scene to save it here for later."
            />
          ) : (
            <View className="items-center gap-md py-xl">
              <EmptyState
                icon={Search}
                title="No matching bookmarks"
                description="Try a different search term or clear your filters."
              />
              <Button label="Clear filters" variant="outline" size="sm" onPress={resetFilters} />
            </View>
          )
        }
      />

      <Sheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        accessibilityLabel="Bookmark sort and filter options"
      >
        <View className="flex-row items-center justify-between px-lg pb-md">
          <Text className="font-inter-bold text-h2 text-foreground">Sort & Filter</Text>
          <IconButton
            icon={RotateCcw}
            accessibilityLabel="Reset sort and filters"
            onPress={handleReset}
            size={18}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: Math.max(240, Math.round(windowHeight * 0.45)) }}
          contentContainerClassName="gap-xl px-lg pb-lg"
        >
          <View className="gap-sm">
            <Text className="font-inter-semibold text-caption text-muted">SORT BY</Text>
            <View className="flex-row flex-wrap gap-sm">
              {SORT_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={BOOKMARK_SORT_LABEL[option]}
                  active={draftSort === option}
                  onPress={() => setDraftSort(option)}
                />
              ))}
            </View>
          </View>

          {seriesOptions.length > 0 ? (
            <View className="gap-sm">
              <Text className="font-inter-semibold text-caption text-muted">SERIES</Text>
              <View className="flex-row flex-wrap gap-sm">
                {seriesOptions.map((option) => (
                  <Chip
                    key={option.slug}
                    label={`${option.title} (${option.count})`}
                    active={draftFilters.series.includes(option.slug)}
                    onPress={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        series: toggleDraftValue(prev.series, option.slug),
                      }))
                    }
                  />
                ))}
              </View>
            </View>
          ) : null}

          {tagOptions.length > 0 ? (
            <View className="gap-sm">
              <Text className="font-inter-semibold text-caption text-muted">TAGS</Text>
              <View className="flex-row flex-wrap gap-sm">
                {tagOptions.map((option) => (
                  <Chip
                    key={option.tag}
                    label={`${option.tag} (${option.count})`}
                    active={draftFilters.tags.includes(option.tag)}
                    onPress={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        tags: toggleDraftValue(prev.tags, option.tag),
                      }))
                    }
                  />
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View className="flex-row gap-md border-t border-border px-lg pt-md">
          <View className="flex-1">
            <Button
              label="Cancel"
              variant="outline"
              fullWidth
              onPress={() => setSheetOpen(false)}
            />
          </View>
          <View className="flex-1">
            <Button label="Apply" variant="primary" fullWidth onPress={applySheet} />
          </View>
        </View>
      </Sheet>
    </Screen>
  );
}
