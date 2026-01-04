'use client';

import { useGameStore } from '@/stores/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const CinematicIntro = () => {
  const isCinematic = useGameStore((state) => state.isCinematic);

  return (
    <AnimatePresence>
      {isCinematic && (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between">
          {/* Top Bar */}
          <motion.div
            initial={{ height: '50vh' }}
            animate={{ height: '10vh' }}
            exit={{ height: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="w-full bg-black block"
          />

          {/* Title Card - Muncul pelan lalu hilang */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[0.5em] uppercase font-mono text-shadow-lg">
                The Voyage
              </h1>
              <p className="text-white/60 mt-4 text-sm tracking-widest">
                INTERACTIVE PORTFOLIO
              </p>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ height: '50vh' }}
            animate={{ height: '10vh' }}
            exit={{ height: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="w-full bg-black block"
          />
        </div>
      )}
    </AnimatePresence>
  );
};
