import type { StateCreator } from 'zustand';

import type { AccentColor, TextSize, ThemeMode } from '@/shared/types/filters';

import type { RootState } from './index';

export interface SettingsSlice {
  themeMode: ThemeMode;
  textSize: TextSize;
  accentColor: AccentColor;
  cacheSizeBytes: number;
  setThemeMode: (mode: ThemeMode) => void;
  setTextSize: (size: TextSize) => void;
  setAccentColor: (accent: AccentColor) => void;
  setCacheSizeBytes: (bytes: number) => void;
}

export const createSettingsSlice: StateCreator<RootState, [], [], SettingsSlice> = (set) => ({
  themeMode: 'dark',
  textSize: 'default',
  accentColor: 'rose',
  cacheSizeBytes: 0,
  setThemeMode: (themeMode) => set({ themeMode }),
  setTextSize: (textSize) => set({ textSize }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setCacheSizeBytes: (cacheSizeBytes) => set({ cacheSizeBytes }),
});
