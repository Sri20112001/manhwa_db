import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { RotateCcw } from '@/ui/icons';

import { useRootStore } from '@/logic/store';
import { Button } from '@/ui/components/primitives/Button';
import { Chip } from '@/ui/components/primitives/Chip';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { RangeSlider } from '@/ui/components/primitives/Slider';
import { Segmented } from '@/ui/components/primitives/Segmented';
import type { BrowseFilters, SeriesStatus } from '@/shared/types/filters';

const TAG_OPTIONS = [
  'Action',
  'Harem',
  'Romance',
  'Fantasy',
  'Drama',
  'Milf',
  'College',
  'Revenge',
  'Netori',
  'Office',
  'Supernatural',
  'Comedy',
  'Mystery',
  'Ecchi',
];

const STATUSES: { label: string; value: SeriesStatus }[] = [
  { label: 'On Going', value: 'On Going' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Hiatus', value: 'Hiatus' },
];

export function FilterSheetModal() {
  const router = useRouter();
  const currentFilters = useRootStore((state) => state.browseFilters);
  const patchFilters = useRootStore((state) => state.patchFilters);
  const resetFilters = useRootStore((state) => state.resetFilters);

  const [draft, setDraft] = useState<BrowseFilters>({ ...currentFilters });

  const handleApply = () => {
    patchFilters(draft);
    router.back();
  };

  const handleReset = () => {
    resetFilters();
    router.back();
  };

  const toggleDraftStatus = (status: SeriesStatus) => {
    setDraft((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const toggleDraftTag = (tag: string) => {
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  return (
    <View className="flex-1 justify-end bg-black/60">
      <View className="max-h-[85%] rounded-t-xl border-t border-border bg-card">
        <View className="items-center pt-sm">
          <View className="h-1.5 w-12 rounded-full bg-border" />
        </View>

        <View className="flex-row items-center justify-between border-b border-border px-lg py-md">
          <Text className="text-h2 font-inter-bold text-foreground">Filters</Text>
          <IconButton
            icon={RotateCcw}
            accessibilityLabel="Reset filters"
            onPress={handleReset}
            size={18}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-xl p-lg pb-2xl"
        >
          <View className="gap-sm">
            <Text className="text-caption font-inter-semibold text-muted">STATUS</Text>
            <View className="flex-row flex-wrap gap-sm">
              {STATUSES.map((s) => (
                <Chip
                  key={s.value}
                  label={s.label}
                  active={draft.status.includes(s.value)}
                  onPress={() => toggleDraftStatus(s.value)}
                />
              ))}
            </View>
          </View>

          <View className="gap-sm">
            <Text className="text-caption font-inter-semibold text-muted">ORIENTATION</Text>
            <Segmented
              options={[
                { label: 'Any', value: 'any' },
                { label: 'Yaoi', value: 'yaoi' },
                { label: 'Yuri', value: 'yuri' },
              ]}
              value={draft.orientation}
              onChange={(val) => setDraft((prev) => ({ ...prev, orientation: val as 'any' | 'yaoi' | 'yuri' }))}
            />
          </View>

          <View className="gap-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-caption font-inter-semibold text-muted">TAGS</Text>
              <View className="w-28">
                <Segmented
                  options={[
                    { label: 'Any', value: 'any' },
                    { label: 'All', value: 'all' },
                  ]}
                  value={draft.tagMode}
                  onChange={(val) =>
                    setDraft((prev) => ({ ...prev, tagMode: val as 'any' | 'all' }))
                  }
                />
              </View>
            </View>
            <View className="flex-row flex-wrap gap-sm">
              {TAG_OPTIONS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  active={draft.tags.includes(tag)}
                  onPress={() => toggleDraftTag(tag)}
                />
              ))}
            </View>
          </View>

          <View className="gap-sm">
            <Text className="text-caption font-inter-semibold text-muted">
              RATING ({draft.rating.min.toFixed(1)} – {draft.rating.max.toFixed(1)})
            </Text>
            <RangeSlider
              min={0}
              max={5}
              step={0.5}
              value={draft.rating}
              onChange={(rating) => setDraft((prev) => ({ ...prev, rating }))}
              formatValue={(v) => v.toFixed(1)}
            />
          </View>

          <View className="gap-sm">
            <Text className="text-caption font-inter-semibold text-muted">
              RELEASE YEAR ({draft.year.min} – {draft.year.max})
            </Text>
            <RangeSlider
              min={1995}
              max={2026}
              step={1}
              value={draft.year}
              onChange={(year) => setDraft((prev) => ({ ...prev, year }))}
            />
          </View>

          <View className="gap-sm">
            <Text className="text-caption font-inter-semibold text-muted">
              CHAPTERS ({draft.chapters.min} – {draft.chapters.max})
            </Text>
            <RangeSlider
              min={1}
              max={500}
              step={5}
              value={draft.chapters}
              onChange={(chapters) => setDraft((prev) => ({ ...prev, chapters }))}
            />
          </View>
        </ScrollView>

        <View className="flex-row gap-md border-t border-border bg-card p-lg">
          <View className="flex-1">
            <Button label="Cancel" variant="outline" onPress={() => router.back()} fullWidth />
          </View>
          <View className="flex-1">
            <Button label="Apply filters" variant="primary" onPress={handleApply} fullWidth />
          </View>
        </View>
      </View>
    </View>
  );
}
