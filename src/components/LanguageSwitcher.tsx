'use client';

import { useLanguageStore } from '@/stores/useLanguageStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Language Configuration & Flag Paths
const LANGUAGES = [
  { id: 'en', label: 'EN', flag: '/us.svg' }, // Points to public/us.svg
  { id: 'id', label: 'ID', flag: '/id.svg' }, // Points to public/id.svg
] as const;

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguageStore();

  return (
    <div className="flex items-center p-1 bg-black/20 backdrop-blur-md border border-white/10 rounded-full pointer-events-auto">
      {LANGUAGES.map((lang) => {
        const isActive = locale === lang.id;

        return (
          <Button
            key={lang.id}
            onClick={() => setLocale(lang.id)}
            className={cn(
              'relative px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-300 z-10 flex items-center gap-2',
              isActive ? 'text-slate-900' : 'text-slate-400 hover:text-white',
            )}
          >
            {/* BACKGROUND SLIDING ANIMATION */}
            {isActive && (
              <motion.div
                layoutId="active-language-bg"
                className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}

            {/* CONTENT: FLAG IMAGE */}
            <div className="relative w-5 h-5 rounded-full overflow-hidden shadow-sm border border-black/10">
              <Image
                src={lang.flag}
                alt={lang.label}
                fill
                className="object-cover"
              />
            </div>

            {/* LABEL TEXT */}
            <span className="font-mono tracking-wider text-xs">
              {lang.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
