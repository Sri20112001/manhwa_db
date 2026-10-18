import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, Bookmark, ChevronRight, Star } from '@/ui/icons';

import { useCharacter } from '@/logic/hooks/useCharacter';
import { formatRating } from '@/shared/lib/format';
import { useSafeBack } from '@/shared/lib/navigation';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { Chip } from '@/ui/components/primitives/Chip';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { RatingStars } from '@/ui/components/domain/RatingStars';
import { Screen } from '@/ui/components/layout/Screen';
import { SkeletonCharacterDetail } from '@/ui/components/feedback/Skeleton';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface CharacterDetailScreenProps {
  id: number;
}

export function CharacterDetailScreen({ id }: CharacterDetailScreenProps) {
  const { goBack, router } = useSafeBack();
  const colors = useThemeColors();
  const { character, isPending, isError, refetch, averageRating, ratingCount, reviews } =
    useCharacter(id);

  if (isPending && !character) {
    return (
      <Screen edges={['top']}>
        <SkeletonCharacterDetail />
      </Screen>
    );
  }

  if (isError && !character) {
    return (
      <Screen edges={['top']} className="items-center justify-center p-xl">
        <ErrorState
          title="Could not load character"
          description="Failed to retrieve character profile."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  if (!character) return null;

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
        right={
          <IconButton
            icon={Bookmark}
            accessibilityLabel="Bookmark character"
            onPress={() => {}}
          />
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-xl p-lg pb-3xl">
        {/* Hero */}
        <View className="items-center gap-md">
          <Avatar uri={character.image} name={character.name} size={96} />
          <Text className="text-h1 font-inter-bold text-foreground text-center">
            {character.name}
          </Text>

          {character.series ? (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Appears in ${character.series.title}`}
              onPress={() => router.push(`/pornhwa/${character.series?.slug}`)}
              className="active:opacity-70"
            >
              <Text className="text-body font-inter-medium text-primary">
                Appears in {character.series.title}
              </Text>
            </Pressable>
          ) : null}

          {character.alternativeNames.length > 0 ? (
            <View className="flex-row flex-wrap justify-center gap-xs">
              {character.alternativeNames.map((name) => (
                <Chip key={name} label={name} tone="outline" />
              ))}
            </View>
          ) : null}

          <View className="flex-row items-center gap-md rounded-full border border-border bg-card px-lg py-xs">
            <View className="flex-row items-center gap-xs">
              <Star size={16} color={colors.primary} fill={colors.primary} />
              <Text className="text-body font-inter-bold text-foreground">
                {formatRating(averageRating)}
              </Text>
              <Text className="text-caption text-muted">({ratingCount})</Text>
            </View>
            <View className="h-4 w-px bg-border" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Rate character"
              onPress={() => router.push(`/review/character_${character.id}`)}
            >
              <Text className="text-caption font-inter-bold text-primary">Rate</Text>
            </Pressable>
          </View>
        </View>

        {/* Tags */}
        {character.tags.length > 0 ? (
          <View className="gap-sm">
            <Text className="text-caption font-inter-semibold text-muted">TAGS</Text>
            <View className="flex-row flex-wrap gap-xs">
              {character.role ? (
                <Chip label={character.role} tone="primary" />
              ) : null}
              {character.tags.map((t) => (
                <Chip key={t} label={t} tone="soft" />
              ))}
            </View>
          </View>
        ) : null}

        {/* About */}
        {character.description ? (
          <View className="gap-xs">
            <Text className="text-h3 font-inter-bold text-foreground">About</Text>
            <Text className="text-body leading-6 text-muted">{character.description}</Text>
          </View>
        ) : null}

        {/* Reviews */}
        <View className="gap-md">
          <View className="flex-row items-center justify-between">
            <Text className="text-h3 font-inter-bold text-foreground">Reviews</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Write review"
              onPress={() => router.push(`/review/character_${character.id}`)}
            >
              <Text className="text-caption font-inter-semibold text-primary">Write review</Text>
            </Pressable>
          </View>

          {reviews.length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="Be the first to review this character."
            />
          ) : (
            reviews.map((rev) => (
              <View
                key={rev.id}
                className="gap-sm rounded-md border border-border bg-card p-md"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-sm">
                    <Avatar uri={rev.avatarImage} name={rev.username} size={28} />
                    <Text className="text-body font-inter-semibold text-foreground">
                      {rev.username}
                    </Text>
                  </View>
                  {rev.rating ? <RatingStars rating={rev.rating} /> : null}
                </View>
                <Text className="text-body text-muted">{rev.text}</Text>
                {rev.createdAt ? (
                  <Text className="text-[11px] text-muted">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        {/* View Series Row */}
        {character.series ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View series ${character.series.title}`}
            onPress={() => router.push(`/pornhwa/${character.series?.slug}`)}
            className="flex-row items-center justify-between rounded-md border border-border bg-card p-lg active:bg-elevated"
          >
            <View className="gap-xs">
              <Text className="text-caption text-muted">SERIES</Text>
              <Text className="text-h3 font-inter-semibold text-foreground">
                {character.series.title}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.muted} />
          </Pressable>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
