import type { StateCreator } from 'zustand';

import type { RootState } from './index';

export interface NotificationsSlice {
  readNotificationIds: string[];
  notificationsLastSeenAt: string | null;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (ids: string[]) => void;
  setNotificationsLastSeenAt: (value: string) => void;
}

export const createNotificationsSlice: StateCreator<RootState, [], [], NotificationsSlice> = (set) => ({
  readNotificationIds: [],
  notificationsLastSeenAt: null,
  markNotificationRead: (id) =>
    set((state) =>
      state.readNotificationIds.includes(id)
        ? state
        : { readNotificationIds: [...state.readNotificationIds, id] },
    ),
  markAllNotificationsRead: (ids) =>
    set((state) => ({
      readNotificationIds: Array.from(new Set([...state.readNotificationIds, ...ids])),
    })),
  setNotificationsLastSeenAt: (notificationsLastSeenAt) => set({ notificationsLastSeenAt }),
});
