import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, Bookmark, Play, Sliders } from '@/ui/icons';

import { useChapters } from '@/logic/hooks/useChapters';
import { useSeries } from '@/logic/hooks/useSeries';
import { useSafeBack } from '@/shared/lib/navigation';
import { ChapterRow } from '@/ui/components/domain/ChapterRow';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Screen } from '@/ui/components/layout/Screen';
import { Segmented } from '@/ui/components/primitives/Segmented';
import { SkeletonSeriesRow } from '@/ui/components/feedback/Skeleton';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface ReaderScreenProps {
  slug: string;
}

export function ReaderScreen({ slug }: ReaderScreenProps) {
  const { goBack, router } = useSafeBack(slug ? `/pornhwa/${slug}` : '/(tabs)');
  const colors = useThemeColors();
  const [segment, setSegment] = useState<'chapters' | 'scenes'>('chapters');

  const { series } = useSeries(slug);
  const { chapters, isPending, isError, refetch } = useChapters(slug, series?.id ?? 0);

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back"
            onPress={goBack}
          />
        }
        title={series?.title ?? 'Reader'}
        right={
          <>
            <IconButton
              icon={Bookmark}
              accessibilityLabel="Bookmark position"
              onPress={() => {}}
            />
            <IconButton
              icon={Sliders}
              accessibilityLabel="Reader preferences"
              onPress={() => router.push('/settings')}
            />
          </>
        }
      />

      <View className="border-b border-border px-lg py-sm">
        <Segmented
          options={[
            { label: 'Chapters', value: 'chapters' },
            { label: 'Scenes', value: 'scenes' },
          ]}
          value={segment}
          onChange={(val) => setSegment(val as 'chapters' | 'scenes')}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-3xl">
        {isPending ? (
          <View className="gap-md p-lg">
            <SkeletonSeriesRow />
            <SkeletonSeriesRow />
            <SkeletonSeriesRow />
          </View>
        ) : isError ? (
          <View className="items-center justify-center p-xl">
            <ErrorState
              title="Could not load chapters"
              description="Failed to load chapter list."
              onRetry={refetch}
            />
          </View>
        ) : chapters.length === 0 ? (
          <View className="py-2xl">
            <EmptyState
              title="No chapters available"
              description="No chapters or scenes listed for this manhwa."
            />
          </View>
        ) : segment === 'chapters' ? (
          <View>
            {chapters.map((ch) => (
              <ChapterRow
                key={ch.id}
                chapter={ch}
                showCharacters={true}
              />
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-sm p-lg">
            {chapters.map((ch) => (
              <View
                key={ch.id}
                className="min-h-28 w-[31%] sm:w-[23%] md:w-[18%] items-center justify-center rounded-md border border-border bg-card p-sm"
              >
                <View className="rounded-sm bg-primary-soft px-sm py-xs">
                  <Text className="text-caption font-inter-bold text-primary">
                    Ch {ch.chapterStart}
                  </Text>
                </View>
                <Text className="mt-xs text-center text-[11px] text-muted" numberOfLines={2}>
                  {ch.description ?? `Scene ${ch.chapterStart}`}
                </Text>
                {ch.characters.length > 0 ? (
                  <View className="mt-xs flex-row flex-wrap items-center justify-center gap-[2px]">
                    {ch.characters.slice(0, 3).map((character) => (
                      <Avatar
                        key={character.id}
                        uri={character.image}
                        name={character.name}
                        size={16}
                      />
                    ))}
                    {ch.characters.length > 3 ? (
                      <Text className="text-[10px] text-muted">+{ch.characters.length - 3}</Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {chapters.length > 0 ? (
        <View className="absolute bottom-6 right-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue reading"
            className="flex-row items-center gap-sm rounded-full bg-primary px-lg py-md shadow-lg active:opacity-80"
          >
            <Play size={18} color={colors.onPrimary} fill={colors.onPrimary} />
            <Text className="text-body font-inter-semibold text-on-primary">Continue</Text>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}
