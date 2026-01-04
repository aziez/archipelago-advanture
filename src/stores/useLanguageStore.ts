import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'en' | 'id';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'en', // Default
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'app-lang' },
  ),
);
