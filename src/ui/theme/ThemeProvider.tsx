import { useEffect } from 'react';
import { View } from 'react-native';
import * as SystemUI from 'expo-system-ui';

import { useRootStore } from '@/logic/store';
import { colorModes } from '@/ui/theme/tokens';
import { themeVars } from '@/ui/theme/vars';

export function useThemeColors() {
  const themeMode = useRootStore((state) => state.themeMode);
  return colorModes[themeMode];
}

export function useThemeMode() {
  return useRootStore((state) => state.themeMode);
}


interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useRootStore((state) => state.themeMode);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colorModes[themeMode].background);
  }, [themeMode]);

  return (
    <View
      className={`flex-1 bg-background ${themeMode === 'light' ? 'light' : themeMode}`}
      style={themeVars[themeMode]}
    >
      {children}
    </View>
  );
}
