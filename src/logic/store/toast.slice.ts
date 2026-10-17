import type { StateCreator } from 'zustand';

import type { ToastMessage } from '@/shared/types/filters';

import type { RootState } from './index';

export interface ToastSlice {
  toasts: ToastMessage[];
  pushToast: (message: string, variant?: ToastMessage['variant']) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

let counter = 0;

export const createToastSlice: StateCreator<RootState, [], [], ToastSlice> = (set) => ({
  toasts: [],
  pushToast: (message, variant = 'info') => {
    counter += 1;
    const id = `toast-${counter}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, 3_500);
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
});
