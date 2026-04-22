import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  confirmDialog: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openConfirm: (dialog) => set({ confirmDialog: dialog }),
  closeConfirm: () => set({ confirmDialog: null }),
}));
