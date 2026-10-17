import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/shared/lib/storage';

import { createAuthSlice, type AuthSlice } from './auth.slice';
import { createBrowseFiltersSlice, type BrowseFiltersSlice } from './browseFilters.slice';
import { createLibraryUiSlice, type LibraryUiSlice } from './libraryUi.slice';
import { createListEditorSlice, type ListEditorSlice } from './listEditor.slice';
import { createNotificationsSlice, type NotificationsSlice } from './notifications.slice';
import { createReaderPrefsSlice, type ReaderPrefsSlice } from './readerPrefs.slice';
import { createReviewEditorSlice, type ReviewEditorSlice } from './reviewEditor.slice';
import { createSearchSlice, type SearchSlice } from './search.slice';
import { createSettingsSlice, type SettingsSlice } from './settings.slice';
import { createToastSlice, type ToastSlice } from './toast.slice';

export type RootState = AuthSlice &
  SettingsSlice &
  BrowseFiltersSlice &
  SearchSlice &
  LibraryUiSlice &
  ListEditorSlice &
  ReviewEditorSlice &
  ReaderPrefsSlice &
  NotificationsSlice &
  ToastSlice;

export const useRootStore = create<RootState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createSettingsSlice(...args),
      ...createBrowseFiltersSlice(...args),
      ...createSearchSlice(...args),
      ...createLibraryUiSlice(...args),
      ...createListEditorSlice(...args),
      ...createReviewEditorSlice(...args),
      ...createReaderPrefsSlice(...args),
      ...createNotificationsSlice(...args),
      ...createToastSlice(...args),
    }),
    {
      name: STORAGE_KEYS.rootStore,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasKey: state.hasKey,
        uid: state.uid,
        username: state.username,
        scopes: state.scopes,
        themeMode: state.themeMode,
        textSize: state.textSize,
        browseFilters: state.browseFilters,
        recentSearches: state.recentSearches,
        searchSegment: state.searchSegment,
        activeStatusTab: state.activeStatusTab,
        librarySort: state.librarySort,
        libraryViewMode: state.libraryViewMode,
        listDraft: state.listDraft,
        readerView: state.readerView,
        lastChapter: state.lastChapter,
        readNotificationIds: state.readNotificationIds,
        notificationsLastSeenAt: state.notificationsLastSeenAt,
      }),
    },
  ),
);

export const store = {
  getState: () => useRootStore.getState(),
  setState: useRootStore.setState,
  subscribe: useRootStore.subscribe,
};
