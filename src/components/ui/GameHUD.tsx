'use client';

import { useGameStore } from '@/stores/useGameStore';
import { Gem, Keyboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPill } from '@/components/ui/glass-pill';

// Helper component untuk animasi angka (Count Up)
const NumberTicker = ({ value }: { value: number }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-block"
    >
      {value}
    </motion.span>
  );
};

export const GameHUD = () => {
  const score = useGameStore((state) => state.score);
  const [isMount, setIsMount] = useState(false);

  useEffect(() => setIsMount(true), []);

  if (!isMount) return null;

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
      {/* SCORE PILL */}
      <GlassPill className="px-4 py-2 flex items-center gap-3 pointer-events-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500 blur-md opacity-50 animate-pulse" />
          <Gem
            className="text-yellow-400 relative z-10"
            size={20}
            fill="currentColor"
          />
        </div>

        <div className="flex flex-col items-end leading-none">
          <span className="text-[10px] text-white/50 font-bold tracking-wider">
            TREASURE
          </span>
          <span className="text-xl font-mono font-bold text-white tabular-nums">
            <NumberTicker value={score} />
          </span>
        </div>
      </GlassPill>

      {/* CONTROLS HINT (HIDDEN ON MOBILE) */}
      <div className="hidden md:block">
        <GlassPill className="px-3 py-2 flex flex-col gap-1 items-end bg-black/40">
          <div className="flex items-center gap-2 text-white/50 text-[10px] font-mono">
            <span>DRIVE</span>
            <Keyboard size={12} />
          </div>
          <div className="flex gap-1">
            {['W', 'A', 'S', 'D'].map((key) => (
              <span
                key={key}
                className="w-5 h-5 flex items-center justify-center rounded bg-white/10 border border-white/10 text-[10px] font-bold text-white"
              >
                {key}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-white/50">TURBO</span>
            <span className="px-1.5 h-4 flex items-center rounded bg-white/10 border border-white/10 text-[9px] font-bold text-white">
              SHIFT
            </span>
          </div>
        </GlassPill>
      </div>
    </div>
  );
};
