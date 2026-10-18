import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from '@/ui/icons';

import { chapterRange } from '@/shared/lib/format';
import type { Chapter } from '@/shared/types/models';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface ChapterRowProps {
  chapter: Chapter;
  onPress?: () => void;
  showCharacters?: boolean;
  variant?: 'row' | 'card';
}

export function ChapterRow({
  chapter,
  onPress,
  showCharacters = true,
  variant = 'row',
}: ChapterRowProps) {
  const colors = useThemeColors();
  const label = `Chapter ${chapterRange(chapter.chapterStart, chapter.chapterEnd)}`;

  if (variant === 'card') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        disabled={!onPress}
        className="mb-md rounded-xl border border-border bg-card p-lg shadow-sm active:bg-elevated"
      >
        {/* Card Header Row */}
        <View className="flex-row items-center justify-between pb-sm border-b border-border/30">
          <View className="flex-row items-center gap-sm">
            <View className="rounded-md bg-primary-soft px-2.5 py-1">
              <Text className="text-caption font-inter-bold text-primary">
                CH {String(chapter.chapterStart).padStart(2, '0')}
              </Text>
            </View>
            <Text className="text-body font-inter-semibold text-foreground">
              {label}
            </Text>
          </View>

          <ChevronRight
            size={iconTokens.size.inline}
            strokeWidth={iconTokens.stroke}
            color={colors.muted}
          />
        </View>

        {/* Card Description */}
        {chapter.description ? (
          <Text className="mt-sm text-caption leading-relaxed text-muted" numberOfLines={2}>
            {chapter.description}
          </Text>
        ) : null}

        {/* Card Footer: Tags & Characters */}
        {(chapter.tags.length > 0 || (showCharacters && chapter.characters.length > 0)) ? (
          <View className="mt-md flex-row flex-wrap items-center justify-between gap-y-xs">
            {chapter.tags.length > 0 ? (
              <View className="flex-row flex-wrap gap-xs">
                {chapter.tags.slice(0, 3).map((tag) => (
                  <View
                    key={tag}
                    className="rounded-full border border-border/70 bg-elevated/80 px-2 py-0.5"
                  >
                    <Text className="text-[11px] font-inter-medium text-muted">{tag}</Text>
                  </View>
                ))}
              </View>
            ) : <View />}

            {showCharacters && chapter.characters.length > 0 ? (
              <View className="flex-row flex-wrap items-center gap-xs">
                {chapter.characters.slice(0, 4).map((character) => (
                  <View
                    key={character.id}
                    className="flex-row items-center gap-1 rounded-full bg-primary-soft/80 pl-1 pr-2 py-0.5"
                  >
                    <Avatar uri={character.image} name={character.name} size={16} />
                    <Text className="text-[11px] font-inter-medium text-primary">
                      {character.name}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center border-b border-border/40 px-lg py-xl active:bg-elevated/40"
    >
      {/* Linear Chapter Index Column */}
      <View className="w-14 justify-center pr-sm">
        <Text
          numberOfLines={1}
          className="text-h2 font-inter-bold tracking-tight text-primary"
        >
          {String(chapter.chapterStart).padStart(2, '0')}
        </Text>
      </View>

      {/* Main Content Column */}
      <View className="flex-1 justify-center gap-xs pr-md">
        {/* Title line */}
        <View className="flex-row items-baseline gap-sm">
          <Text className="text-body font-inter-semibold text-foreground">
            {label}
          </Text>
        </View>

        {/* Optional chapter description */}
        {chapter.description ? (
          <Text className="text-caption leading-relaxed text-muted" numberOfLines={1}>
            {chapter.description}
          </Text>
        ) : null}

        {/* Linear metadata row: tags + characters */}
        {(chapter.tags.length > 0 || (showCharacters && chapter.characters.length > 0)) ? (
          <View className="mt-1 flex-row flex-wrap items-center gap-x-sm gap-y-xs">
            {/* Tags */}
            {chapter.tags.slice(0, 3).map((tag) => (
              <View
                key={tag}
                className="rounded-full border border-border/70 bg-card/60 px-2 py-0.5"
              >
                <Text className="text-[11px] font-inter-medium text-muted">{tag}</Text>
              </View>
            ))}

            {/* Character badges */}
            {showCharacters &&
              chapter.characters.map((character) => (
                <View
                  key={character.id}
                  className="flex-row items-center gap-1 rounded-full bg-primary-soft/60 pl-1 pr-2 py-0.5"
                >
                  <Avatar uri={character.image} name={character.name} size={16} />
                  <Text className="text-[11px] font-inter-medium text-primary">
                    {character.name}
                  </Text>
                </View>
              ))}
          </View>
        ) : null}
      </View>

      {/* Linear Trailing Action Chevron */}
      <View className="pl-xs">
        <ChevronRight
          size={iconTokens.size.inline}
          strokeWidth={iconTokens.stroke}
          color={colors.muted}
        />
      </View>
    </Pressable>
  );
}
