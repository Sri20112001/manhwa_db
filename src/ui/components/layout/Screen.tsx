import { ScrollView, View } from 'react-native';
import type { RefreshControlProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';

import { cn } from '@/shared/lib/cn';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  edges?: Edge[];
}

export function Screen({ children, className, edges = ['top'] }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-background', className)}>
      {children}
    </SafeAreaView>
  );
}

interface ScreenScrollProps extends ScreenProps {
  contentClassName?: string;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export function ScreenScroll({
  children,
  className,
  contentClassName,
  edges = ['top'],
  refreshControl,
}: ScreenScrollProps) {
  return (
    <Screen className={className} edges={edges}>
      <ScrollView
        refreshControl={refreshControl}
        contentContainerClassName={cn('pb-2xl', contentClassName)}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Screen>
  );
}

export function ScreenBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={cn('flex-1', className)}>{children}</View>;
}
