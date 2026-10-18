import { useEffect } from 'react';
import { View } from 'react-native';
import * as SystemUI from 'expo-system-ui';

import { useRootStore } from '@/logic/store';
import { colorModes, getColorsWithAccent } from '@/ui/theme/tokens';
import { buildThemeVars } from '@/ui/theme/vars';

export function useThemeColors() {
  const themeMode = useRootStore((state) => state.themeMode);
  const accentColor = useRootStore((state) => state.accentColor);
  return getColorsWithAccent(themeMode, accentColor);
}

export function useThemeMode() {
  return useRootStore((state) => state.themeMode);
}

export function useAccentColor() {
  return useRootStore((state) => state.accentColor);
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useRootStore((state) => state.themeMode);
  const accentColor = useRootStore((state) => state.accentColor);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colorModes[themeMode].background);
  }, [themeMode]);

  return (
    <View
      className={`flex-1 bg-background ${themeMode === 'light' ? 'light' : themeMode}`}
      style={buildThemeVars(themeMode, accentColor)}
    >
      {children}
    </View>
  );
}
