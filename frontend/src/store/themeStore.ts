import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (val: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: (() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('qd-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })(),
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem('qd-theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
      return { isDark: next };
    }),
  setDark: (val) => {
    localStorage.setItem('qd-theme', val ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', val);
    set({ isDark: val });
  },
}));
