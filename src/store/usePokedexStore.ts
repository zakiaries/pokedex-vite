import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PokedexFilters } from '../types';

interface PokedexState {
  favorites: number[];
  filters: PokedexFilters;
  currentPage: number;
  toggleFavorite: (id: number) => void;
  setFilters: (newFilters: Partial<PokedexFilters>) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
}

export const usePokedexStore = create<PokedexState>()(
  persist(
    (set, get) => ({
      favorites: [],
      filters: {
        search: '',
        generation: '',
        type: '',
        sortBy: 'nomor-asc',
      },
      currentPage: 1,
      toggleFavorite: (id) => {
        const favorites = get().favorites;
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter((favId) => favId !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, 
        })),
      resetFilters: () =>
        set({
          filters: { search: '', generation: '', type: '', sortBy: 'nomor-asc' },
          currentPage: 1,
        }),
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'pokedex-storage',
    }
  )
);