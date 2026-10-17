import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { chapterRange } from '@/shared/lib/format';
import type { Chapter } from '@/shared/types/models';
import { Chip } from '@/ui/components/primitives/Chip';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface ChapterRowProps {
  chapter: Chapter;
  onPress?: () => void;
  showCharacters?: boolean;
}

export function ChapterRow({ chapter, onPress, showCharacters }: ChapterRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Chapter ${chapterRange(chapter.chapterStart, chapter.chapterEnd)}`}
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-md border-b border-border px-lg py-md active:bg-elevated"
    >
      <View className="h-12 w-12 items-center justify-center rounded-md bg-primary-soft">
        <Text className="text-h3 font-inter-bold text-primary">{chapter.chapterStart}</Text>
      </View>
      <View className="flex-1 gap-xs">
        <Text className="text-body font-inter-semibold text-foreground">
          {chapterRange(chapter.chapterStart, chapter.chapterEnd)}
        </Text>
        {chapter.description ? (
          <Text className="text-caption text-muted" numberOfLines={1}>
            {chapter.description}
          </Text>
        ) : null}
        {chapter.tags.length > 0 ? (
          <View className="flex-row flex-wrap gap-xs">
            {chapter.tags.slice(0, 3).map((tag) => (
              <View key={tag} className="rounded-sm bg-elevated px-sm py-[2px]">
                <Text className="text-[11px] text-muted">{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {showCharacters && chapter.characters.length > 0 ? (
          <View className="flex-row flex-wrap gap-xs">
            {chapter.characters.slice(0, 3).map((character) => (
              <Chip key={character.id} label={character.name} tone="soft" />
            ))}
          </View>
        ) : null}
      </View>
      <ChevronRight size={iconTokens.size.inline} strokeWidth={iconTokens.stroke} color={colors.muted} />
    </Pressable>
  );
}
