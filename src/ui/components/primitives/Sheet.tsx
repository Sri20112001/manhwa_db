import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/shared/lib/cn';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  accessibilityLabel: string;
}

export function Sheet({ visible, onClose, children, className, accessibilityLabel }: SheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
          className="flex-1"
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          className={cn(
            'max-h-[88%] rounded-t-xl border border-border bg-card pb-lg',
            className,
          )}
        >
          <View className="items-center py-md">
            <View className="h-1 w-10 rounded-pill bg-border" />
          </View>
          <SafeAreaView edges={['bottom']} className="flex-shrink">
            {children}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
