import { create } from 'zustand';

const useSettingsStore = create((set) => ({
  darkMode: false,
  favoritePlatform: 'Codeforces',
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setFavoritePlatform: (platform) => set({ favoritePlatform: platform }),
}));

export default useSettingsStore;