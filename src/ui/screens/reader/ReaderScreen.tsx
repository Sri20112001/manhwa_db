import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, ChevronRight, Play, Sliders } from '@/ui/icons';

import { useChapters } from '@/logic/hooks/useChapters';
import { useSeries } from '@/logic/hooks/useSeries';
import { chapterRange } from '@/shared/lib/format';
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
  const router = useRouter();
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
            onPress={() => router.back()}
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
              <Pressable
                key={ch.id}
                accessibilityRole="button"
                accessibilityLabel={`Chapter ${ch.chapterStart}`}
                className="flex-row items-center gap-md border-b border-border px-lg py-md active:bg-elevated"
              >
                <View className="h-12 w-12 items-center justify-center rounded-md bg-primary-soft">
                  <Text className="text-h3 font-inter-bold text-primary">{ch.chapterStart}</Text>
                </View>
                <View className="flex-1 gap-xs">
                  <Text className="text-body font-inter-semibold text-foreground">
                    Chapter {chapterRange(ch.chapterStart, ch.chapterEnd)}
                  </Text>
                  {ch.description ? (
                    <Text className="text-caption text-muted" numberOfLines={1}>
                      {ch.description}
                    </Text>
                  ) : null}
                  {ch.tags.length > 0 ? (
                    <View className="flex-row flex-wrap gap-xs">
                      {ch.tags.slice(0, 3).map((tag) => (
                        <View key={tag} className="rounded-sm bg-elevated px-sm py-[2px]">
                          <Text className="text-[11px] text-muted">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
                <ChevronRight size={18} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-sm p-lg">
            {chapters.map((ch) => (
              <View
                key={ch.id}
                className="h-28 w-[31%] items-center justify-center rounded-md border border-border bg-card p-sm"
              >
                <View className="rounded-sm bg-primary-soft px-sm py-xs">
                  <Text className="text-caption font-inter-bold text-primary">
                    Ch {ch.chapterStart}
                  </Text>
                </View>
                <Text className="mt-xs text-center text-[11px] text-muted" numberOfLines={2}>
                  {ch.description ?? `Scene ${ch.chapterStart}`}
                </Text>
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
