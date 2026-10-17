import type { StateCreator } from 'zustand';

import type { TextSize, ThemeMode } from '@/shared/types/filters';

import type { RootState } from './index';

export interface SettingsSlice {
  themeMode: ThemeMode;
  textSize: TextSize;
  cacheSizeBytes: number;
  setThemeMode: (mode: ThemeMode) => void;
  setTextSize: (size: TextSize) => void;
  setCacheSizeBytes: (bytes: number) => void;
}

export const createSettingsSlice: StateCreator<RootState, [], [], SettingsSlice> = (set) => ({
  themeMode: 'dark',
  textSize: 'default',
  cacheSizeBytes: 0,
  setThemeMode: (themeMode) => set({ themeMode }),
  setTextSize: (textSize) => set({ textSize }),
  setCacheSizeBytes: (cacheSizeBytes) => set({ cacheSizeBytes }),
});
