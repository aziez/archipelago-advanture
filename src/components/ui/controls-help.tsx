'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';

const Key = ({ char, label }: { char: string; label?: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="w-12 h-12 border border-white/20 bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center shadow-[0_4px_0_rgba(255,255,255,0.1)] text-white font-bold font-mono text-xl">
      {char}
    </div>
    {label && (
      <span className="text-[10px] text-white/70 uppercase font-mono tracking-wider bg-black/20 px-1 rounded">
        {label}
      </span>
    )}
  </div>
);

export const ControlsHelp = () => {
  const isCinematic = useGameStore((state) => state.isCinematic);
  const boatSpeedRef = useGameStore((state) => state.boatSpeedRef);

  const [isVisible, setIsVisible] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    // Munculkan delay 1 detik setelah cinematic selesai
    if (!isCinematic && !hasMoved) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    if (isCinematic) setIsVisible(false);
  }, [isCinematic, hasMoved]);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      // Hilang jika kapal bergerak
      if (Math.abs(boatSpeedRef.current) > 2) {
        setIsVisible(false);
        setHasMoved(true);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isVisible, boatSpeedRef]);

  return (
    <AnimatePresence>
      {isVisible && (
        // WRAPPER: Full Screen Flexbox untuk Center Positioning
        // pt-32 artinya agak turun dikit (biar gak nutupin kapal)
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center pt-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            className="flex flex-col items-center gap-8"
          >
            {/* JUDUL KECIL (Opsional, biar user tau ini tutorial) */}
            <div className="text-white/50 text-xs font-mono tracking-[0.3em] uppercase -mb-2.5">
              Boat Controls
            </div>

            {/* WASD & SHIFT */}
            <div className="flex items-end gap-6 bg-black/20 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
              {/* WASD */}
              <div className="flex flex-col gap-2 items-center">
                <Key char="W" />
                <div className="flex gap-2">
                  <Key char="A" />
                  <Key char="S" label="Stop" />
                  <Key char="D" />
                </div>
              </div>

              {/* SHIFT */}
              <div className="flex flex-col items-center justify-end h-full pb-5">
                <div className="h-12 px-6 border border-white/20 bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center shadow-[0_4px_0_rgba(255,255,255,0.1)] text-white font-bold font-mono text-sm">
                  SHIFT
                </div>
                <span className="text-[10px] text-white/70 uppercase font-mono tracking-wider mt-2 bg-black/20 px-1 rounded">
                  Turbo
                </span>
              </div>
            </div>

            {/* MOUSE INFO */}
            <div className="flex items-center gap-4 text-white/60">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                <MousePointer2 size={16} className="animate-pulse" />
                <span className="text-xs font-mono uppercase">
                  Drag to Look
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
