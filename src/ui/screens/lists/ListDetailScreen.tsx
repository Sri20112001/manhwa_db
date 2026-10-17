import { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, ChevronRight, Heart, Layers, Share2, Users } from '@/ui/icons';

import { useListDetail } from '@/logic/hooks/useLists';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { Button } from '@/ui/components/primitives/Button';
import { Chip } from '@/ui/components/primitives/Chip';
import { Collage } from '@/ui/components/cover/Collage';
import { CoverThumb } from '@/ui/components/cover/CoverThumb';
import { EmptyState } from '@/ui/components/feedback/EmptyState';
import { ErrorState } from '@/ui/components/feedback/ErrorState';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Screen } from '@/ui/components/layout/Screen';
import { SkeletonSeriesDetail } from '@/ui/components/feedback/Skeleton';
import type { ListItem } from '@/shared/types/models';
import { StatusChip } from '@/ui/components/domain/StatusChip';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface ListDetailScreenProps {
  username: string;
  slug: string;
}

export function ListDetailScreen({ username, slug }: ListDetailScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const { list: detail, isPending, isError, refetch, toggleLike, isLiking } =
    useListDetail(username, slug);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (isPending && !detail) {
    return (
      <Screen edges={['top']}>
        <SkeletonSeriesDetail />
      </Screen>
    );
  }

  if (isError && !detail) {
    return (
      <Screen edges={['top']} className="items-center justify-center p-xl">
        <ErrorState
          title="Could not load list"
          description="Failed to retrieve custom list details."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  if (!detail) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${detail.title} by ${detail.username ?? 'user'}: https://pornhwadb.com/lists/${username}/${slug}`,
      });
    } catch {
      // ignore
    }
  };

  return (
    <Screen edges={['top']}>
      {/* Header controls */}
      <View className="flex-row items-center justify-between border-b border-border bg-card p-sm">
        <IconButton
          icon={ArrowLeft}
          accessibilityLabel="Back"
          onPress={() => router.back()}
        />
        <View className="flex-row items-center gap-xs">
          <IconButton
            icon={Share2}
            accessibilityLabel="Share list"
            onPress={handleShare}
          />
          <IconButton
            icon={Bookmark}
            accessibilityLabel={isSaved ? 'Unsave list' : 'Save list'}
            variant={isSaved ? 'primary-soft' : 'plain'}
            onPress={() => setIsSaved(!isSaved)}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-3xl">
        {/* Collage Banner & Details */}
        <View className="items-center gap-md border-b border-border bg-card p-lg">
          <Collage images={detail.coverImages} size={140} />
          <Text className="text-center text-h1 font-inter-bold text-foreground">
            {detail.title}
          </Text>

          {detail.description ? (
            <Text className="text-center text-body text-muted">{detail.description}</Text>
          ) : null}

          <View className="flex-row flex-wrap items-center justify-center gap-md">
            {detail.username ? (
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`View ${detail.username}'s profile`}
                onPress={() => router.push(`/u/${detail.username}`)}
                className="flex-row items-center gap-xs active:opacity-70"
              >
                <Avatar uri={detail.avatarImage} name={detail.username} size={24} />
                <Text className="text-body font-inter-semibold text-foreground">
                  {detail.username}
                </Text>
              </Pressable>
            ) : null}

            <View className="flex-row items-center gap-xs">
              <Heart size={14} color={colors.primary} />
              <Text className="text-caption text-muted">{detail.likeCount}</Text>
            </View>

            <View className="flex-row items-center gap-xs">
              <Layers size={14} color={colors.muted} />
              <Text className="text-caption text-muted">{detail.itemCount} items</Text>
            </View>

            {detail.isCollaborative ? (
              <Chip icon={Users} label="Collaborative" tone="soft" />
            ) : null}
          </View>
        </View>

        {/* Ordered Item Rows */}
        <View className="p-lg">
          {detail.items.length === 0 ? (
            <EmptyState title="No items in list" description="This list doesn't contain any manhwa entries yet." />
          ) : (
            detail.items.map((item: ListItem, index: number) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.title ?? 'Manhwa'}
                onPress={() => item.slug && router.push(`/pornhwa/${item.slug}`)}
                className="mb-md flex-row items-center gap-md rounded-md border border-border bg-card p-md active:bg-elevated"
              >
                <View className="h-8 w-8 items-center justify-center rounded-full bg-elevated">
                  <Text className="text-caption font-inter-bold text-muted">
                    {item.position ?? index + 1}
                  </Text>
                </View>

                <CoverThumb uri={item.coverImage} width={48} height={72} />

                <View className="flex-1 gap-xs">
                  <Text className="text-body font-inter-semibold text-foreground" numberOfLines={1}>
                    {item.title ?? 'Untitled'}
                  </Text>
                  {item.notes ? (
                    <Text className="text-caption text-muted" numberOfLines={2}>
                      "{item.notes}"
                    </Text>
                  ) : null}
                  {item.status ? (
                    <View className="self-start">
                      <StatusChip status={item.status as any} />
                    </View>
                  ) : null}
                </View>

                <ChevronRight size={18} color={colors.muted} />
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="flex-row gap-md border-t border-border bg-card p-lg">
        <View className="flex-1">
          <Button
            label={isLiked ? 'Liked' : 'Like list'}
            icon={Heart}
            variant={isLiked ? 'primary' : 'outline'}
            loading={isLiking}
            onPress={() => {
              const next = !isLiked;
              setIsLiked(next);
              toggleLike(next);
            }}
            fullWidth
          />
        </View>
        <View className="flex-1">
          <Button
            label={isSaved ? 'Saved' : 'Save'}
            icon={Bookmark}
            variant={isSaved ? 'secondary' : 'outline'}
            onPress={() => setIsSaved(!isSaved)}
            fullWidth
          />
        </View>
      </View>
    </Screen>
  );
}
