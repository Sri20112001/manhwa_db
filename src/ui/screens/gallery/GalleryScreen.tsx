import { useMemo, useState } from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ExternalLink, RefreshCcw, Search, X } from '@/ui/icons';

import type { GalleryPanel, GallerySort } from '@/api/endpoints/gallery';
import { useGallery } from '@/logic/hooks/useGallery';
import { SITE_BASE_URL } from '@/shared/constants/config';
import { GalleryGrid } from '@/ui/components/cover/GalleryGrid';
import { GalleryViewer } from '@/ui/components/domain/GalleryViewer';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { Screen } from '@/ui/components/layout/Screen';
import { Button } from '@/ui/components/primitives/Button';
import { Chip } from '@/ui/components/primitives/Chip';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Input } from '@/ui/components/primitives/Input';

const SORTS: { label: string; value: GallerySort }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Popular', value: 'popular_all' },
  { label: 'Oldest', value: 'oldest' },
];

export interface GalleryScreenProps {
  initialPornhwaId?: number;
  initialPornhwaTitle?: string;
  initialCharacterId?: number;
  initialCharacterName?: string;
}

export function GalleryScreen({
  initialPornhwaId,
  initialPornhwaTitle,
  initialCharacterId,
  initialCharacterName,
}: GalleryScreenProps) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<GallerySort>('newest');
  const [activePanel, setActivePanel] = useState<GalleryPanel | null>(null);

  const [pornhwaId, setPornhwaId] = useState<number | undefined>(initialPornhwaId);
  const [pornhwaTitle, setPornhwaTitle] = useState<string | undefined>(initialPornhwaTitle);
  const [characterId, setCharacterId] = useState<number | undefined>(initialCharacterId);
  const [characterName, setCharacterName] = useState<string | undefined>(initialCharacterName);

  const filters = useMemo(
    () => ({
      pornhwaIds: pornhwaId ? [pornhwaId] : undefined,
      characterIds: characterId ? [characterId] : undefined,
    }),
    [pornhwaId, characterId],
  );

  const {
    panels,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useGallery(search, sort, filters);

  const submitSearch = () => setSearch(searchInput.trim());

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const clearTargetFilter = () => {
    setPornhwaId(undefined);
    setPornhwaTitle(undefined);
    setCharacterId(undefined);
    setCharacterName(undefined);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const title = characterName
    ? `${characterName} Gallery`
    : pornhwaTitle
      ? `${pornhwaTitle} Gallery`
      : 'Gallery';

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={<IconButton icon={ArrowLeft} accessibilityLabel="Go back" onPress={goBack} />}
        title={title}
        right={
          <IconButton icon={RefreshCcw} accessibilityLabel="Refresh gallery" onPress={refetch} />
        }
      />

      <View className="gap-sm border-b border-border px-lg py-sm">
        <Input
          placeholder="Search titles, characters, or tags..."
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={submitSearch}
          returnKeyType="search"
          leadingIcon={Search}
          accessibilityLabel="Search gallery"
          trailing={
            searchInput ? (
              <IconButton
                icon={X}
                accessibilityLabel="Clear gallery search"
                onPress={clearSearch}
                size={16}
              />
            ) : null
          }
        />

        {/* Active Filter Pill */}
        {(pornhwaId || characterId) && (
          <View className="flex-row items-center gap-xs">
            <View className="flex-row items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 pl-3 pr-1 py-0.5">
              <Text className="text-caption font-inter-semibold text-primary">
                {characterName ?? (characterId ? `Character #${characterId}` : null)}
                {pornhwaTitle ?? (pornhwaId ? `Series #${pornhwaId}` : null)}
              </Text>
              <IconButton
                icon={X}
                size={14}
                accessibilityLabel="Clear filter and show all"
                onPress={clearTargetFilter}
              />
            </View>
          </View>
        )}

        <View className="flex-row flex-wrap gap-sm">
          {SORTS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              active={sort === option.value}
              onPress={() => setSort(option.value)}
            />
          ))}
        </View>
      </View>

      {isError && panels.length === 0 ? (
        <View className="flex-1 items-center justify-center p-xl">
          <ErrorState
            title="Could not load gallery"
            description={
              error?.message ??
              'The gallery is unavailable right now. Try again in a moment.'
            }
            onRetry={refetch}
          />
          {Platform.OS === 'web' && (
            <View className="mt-md w-full max-w-xs">
              <Button
                label="Open on PornhwaDB (Web)"
                variant="outline"
                icon={ExternalLink}
                fullWidth
                onPress={() => Linking.openURL(`${SITE_BASE_URL}/gallery`)}
              />
            </View>
          )}
        </View>
      ) : (
        <GalleryGrid
          panels={panels}
          onPressPanel={setActivePanel}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          isPending={isPending}
          isFetchingNextPage={isFetchingNextPage}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      )}

      <GalleryViewer
        panel={activePanel}
        onClose={() => setActivePanel(null)}
        onOpenSeries={(slug) => {
          setActivePanel(null);
          router.push(`/pornhwa/${slug}`);
        }}
      />
    </Screen>
  );
}
