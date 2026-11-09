import { create } from 'zustand';

type FilmFiltersState = {
  query: string;
  director: string | null;
  setQuery: (query: string) => void;
  setDirector: (director: string | null) => void;
};

export const useFilmFiltersStore = create<FilmFiltersState>((set) => ({
  query: '',
  director: null,
  setQuery: (query) => set({ query }),
  setDirector: (director) => set({ director }),
}));
