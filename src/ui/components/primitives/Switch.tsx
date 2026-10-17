import { Switch as RNSwitch } from 'react-native';

import { useThemeColors } from '@/ui/theme/ThemeProvider';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
}

export function Switch({ value, onValueChange, accessibilityLabel, disabled }: SwitchProps) {
  const colors = useThemeColors();
  return (
    <RNSwitch
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      value={value}
      disabled={disabled}
      onValueChange={onValueChange}
      trackColor={{ false: colors.elevated, true: colors.primary }}
      thumbColor={colors.foreground}
      ios_backgroundColor={colors.elevated}
    />
  );
}
