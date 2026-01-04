import { useLanguageStore } from '@/stores/useLanguageStore';
import { DICTIONARY } from '@/constants/dictionary';

export const useText = () => {
  // Ambil state lang dari store bahasa
  const lang = useLanguageStore((state) => state.lang);

  // Return kamus sesuai bahasa yang aktif
  return DICTIONARY[lang];
};
