import { useMemo, useRef, useState } from 'react';
import { PanResponder, Text, View, type LayoutChangeEvent } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

export interface RangeValue {
  min: number;
  max: number;
}

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

const THUMB = 24;

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => String(v),
  label,
  className,
}: RangeSliderProps) {
  const colors = useThemeColors();
  const [width, setWidth] = useState(0);
  const valueRef = useRef(value);
  valueRef.current = value;
  const widthRef = useRef(0);
  widthRef.current = width;

  const snap = (raw: number): number => {
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, stepped));
  };

  const toX = (v: number): number => {
    if (max === min) return 0;
    return ((v - min) / (max - min)) * widthRef.current;
  };

  const fromX = (x: number): number => {
    if (widthRef.current === 0) return min;
    return snap(min + (x / widthRef.current) * (max - min));
  };

  const minResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_event, gesture) => {
          const next = Math.min(fromX(toX(valueRef.current.min) + gesture.dx), valueRef.current.max);
          onChange({ min: next, max: valueRef.current.max });
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange, min, max, step],
  );

  const maxResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_event, gesture) => {
          const next = Math.max(fromX(toX(valueRef.current.max) + gesture.dx), valueRef.current.min);
          onChange({ min: valueRef.current.min, max: next });
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange, min, max, step],
  );

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const minLeft = Math.max(0, toX(value.min) - THUMB / 2);
  const maxLeft = Math.max(0, toX(value.max) - THUMB / 2);
  const fillLeft = toX(value.min);
  const fillWidth = Math.max(0, toX(value.max) - toX(value.min));

  return (
    <View className={cn('gap-sm', className)}>
      <View className="flex-row items-center justify-between">
        {label ? <Text className="text-caption text-muted">{label}</Text> : <View />}
        <Text className="text-caption font-inter-semibold text-foreground">
          {formatValue(value.min)} – {formatValue(value.max)}
        </Text>
      </View>
      <View className="h-6 justify-center" onLayout={onLayout}>
        <View className="h-1 w-full rounded-pill bg-elevated" />
        <View
          className="absolute h-1 rounded-pill bg-primary"
          style={{ left: fillLeft, width: fillWidth }}
        />
        <View
          accessibilityRole="adjustable"
          accessibilityLabel={`${label ?? 'Range'} minimum`}
          className="absolute h-6 w-6 items-center justify-center"
          style={{ left: minLeft }}
          {...minResponder.panHandlers}
        >
          <View
            className="h-5 w-5 rounded-full border-2 bg-background"
            style={{ borderColor: colors.primary }}
          />
        </View>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel={`${label ?? 'Range'} maximum`}
          className="absolute h-6 w-6 items-center justify-center"
          style={{ left: maxLeft }}
          {...maxResponder.panHandlers}
        >
          <View
            className="h-5 w-5 rounded-full border-2 bg-background"
            style={{ borderColor: colors.primary }}
          />
        </View>
      </View>
    </View>
  );
}

export function Slider(props: RangeSliderProps) {
  return <RangeSlider {...props} />;
}
