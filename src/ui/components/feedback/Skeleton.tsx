import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={{ opacity }} className={cn('rounded-md bg-card', className)} />;
}

export function SkeletonCover({ className }: SkeletonProps) {
  return <Skeleton className={cn('aspect-[2/3] w-full', className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <View className={cn('gap-sm', className)}>
      <SkeletonCover />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </View>
  );
}

export const SkeletonCoverCard = SkeletonCard;

export function SkeletonRow({ className }: SkeletonProps) {
  return (
    <View className={cn('flex-row items-center gap-md px-lg py-md', className)}>
      <Skeleton className="h-24 w-16" />
      <View className="flex-1 gap-sm">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2 w-full" />
      </View>
    </View>
  );
}

export const SkeletonSeriesRow = SkeletonRow;

export function SkeletonSeriesDetail() {
  return (
    <View className="gap-lg p-lg">
      <Skeleton className="h-56 w-full" />
      <View className="flex-row items-end gap-md">
        <Skeleton className="h-36 w-24" />
        <View className="flex-1 gap-sm">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </View>
      </View>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
    </View>
  );
}

export function SkeletonCharacterDetail() {
  return (
    <View className="items-center gap-md p-lg">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-10 w-32 rounded-full" />
      <Skeleton className="h-32 w-full mt-lg" />
    </View>
  );
}
