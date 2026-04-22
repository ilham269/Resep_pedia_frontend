import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  query: '',
  filters: { category: '', region: '', country: '', difficulty: '', sort: 'newest' },
  isOpen: false,
  setQuery: (query) => set({ query }),
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  clearFilters: () => set({ filters: { category: '', region: '', country: '', difficulty: '', sort: 'newest' }, query: '' }),
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false }),
}));
