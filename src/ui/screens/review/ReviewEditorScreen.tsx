import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Star } from '@/ui/icons';

import { useReviewEditor } from '@/logic/hooks/useReviewEditor';
import { useSeries } from '@/logic/hooks/useSeries';
import { Button } from '@/ui/components/primitives/Button';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Input } from '@/ui/components/primitives/Input';
import { Screen } from '@/ui/components/layout/Screen';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface ReviewEditorScreenProps {
  identifier: string;
}

export function ReviewEditorScreen({ identifier }: ReviewEditorScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const { series } = useSeries(identifier);
  const { draft, save } = useReviewEditor(identifier);

  const [rating, setRating] = useState<number | null>(draft?.rating ?? 4);
  const [reviewText, setReviewText] = useState(draft?.text ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await save({
      identifier,
      pornhwaId: series?.id ?? 0,
      text: reviewText,
      rating,
    });
    setIsSubmitting(false);
    router.back();
  };

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
        title={series?.title ? `Review: ${series.title}` : 'Write Review'}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-xl p-lg pb-3xl">
        {/* Rating Stars Selector */}
        <View className="items-center gap-md rounded-md border border-border bg-card p-lg">
          <Text className="text-caption font-inter-semibold text-muted">YOUR RATING</Text>
          <View className="flex-row items-center gap-md">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = rating != null && rating >= star;
              return (
                <Pressable
                  key={star}
                  accessibilityRole="button"
                  accessibilityLabel={`Rate ${star} stars`}
                  onPress={() => setRating(star)}
                  className="p-xs active:scale-110"
                >
                  <Star
                    size={36}
                    color={active ? colors.primary : colors.muted}
                    fill={active ? colors.primary : 'transparent'}
                  />
                </Pressable>
              );
            })}
          </View>
          <Text className="text-body font-inter-bold text-foreground">
            {rating != null ? `${rating} / 5` : 'No rating selected'}
          </Text>
        </View>

        {/* Review Text Input */}
        <View className="gap-sm">
          <Text className="text-caption font-inter-semibold text-muted">YOUR REVIEW (OPTIONAL)</Text>
          <Input
            placeholder="Share your thoughts on the plot, characters, and artwork..."
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={6}
            containerClassName="h-40 items-start py-md"
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="border-t border-border bg-card p-lg">
        <Button
          label="Save & post review"
          icon={Check}
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
        />
      </View>
    </Screen>
  );
}
