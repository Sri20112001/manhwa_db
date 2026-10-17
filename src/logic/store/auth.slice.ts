import type { StateCreator } from 'zustand';

import type { RootState } from './index';

export interface AuthSlice {
  hasKey: boolean;
  uid: string | null;
  username: string | null;
  scopes: string[];
  isValidating: boolean;
  setSession: (session: { uid: string; username: string; scopes: string[] }) => void;
  setValidating: (value: boolean) => void;
  clearSession: () => void;
  hasScope: (scope: string) => boolean;
}

export const createAuthSlice: StateCreator<RootState, [], [], AuthSlice> = (set, get) => ({
  hasKey: false,
  uid: null,
  username: null,
  scopes: [],
  isValidating: false,
  setSession: ({ uid, username, scopes }) =>
    set({ hasKey: true, uid, username, scopes, isValidating: false }),
  setValidating: (value) => set({ isValidating: value }),
  clearSession: () => set({ hasKey: false, uid: null, username: null, scopes: [] }),
  hasScope: (scope) => get().scopes.includes(scope),
});
