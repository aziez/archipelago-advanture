'use client';

import { useState } from 'react';
import { Play, Pause, Zap, ChevronDown, Sun, Moon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { cn } from '@/lib/utils';
import { GlassPill } from '@/components/ui/glass-pill';
import { Button } from '@/components/ui/button';

export const TimeControls = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { time, isPaused, speed, setTime, togglePause, setSpeed } =
    useGameStore();

  const formattedTime = `${Math.floor(time)
    .toString()
    .padStart(2, '0')}:${Math.floor((time % 1) * 60)
    .toString()
    .padStart(2, '0')}`;

  const isDay = time >= 5 && time < 18;

  // REMOVED: absolute top-4 left-4
  // The parent container in Scene.tsx will handle positioning
  return (
    <div className="pointer-events-none relative z-20">
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        {/* MAIN TOGGLE PILL */}
        <GlassPill
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 px-4 py-2 hover:border-white/20 cursor-pointer"
        >
          {/* Icon Matahari/Bulan dinamis */}
          <div
            className={cn(
              'p-1.5 rounded-full transition-colors',
              isDay
                ? 'bg-orange-500/20 text-orange-300'
                : 'bg-blue-500/20 text-blue-300',
            )}
          >
            {isDay ? <Sun size={14} /> : <Moon size={14} />}
          </div>

          <span className="font-mono text-sm font-bold tracking-widest text-white/90">
            {formattedTime}
          </span>

          <ChevronDown
            size={16}
            className={cn(
              'text-white/50 transition-transform duration-300',
              isExpanded && 'rotate-180',
            )}
          />
        </GlassPill>

        {/* EXPANDED CONTROLS */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="origin-top-right absolute top-full right-0 mt-2" // Changed to origin-top-right to expand downwards from right
            >
              <GlassPill className="p-4 w-70 max-w-[calc(100vw-2rem)] flex flex-col gap-4 bg-slate-900/90 backdrop-blur-xl">
                {/* Time Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-white/40 font-mono uppercase tracking-wider">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>24:00</span>
                  </div>
                  <Slider
                    defaultValue={[time]}
                    value={[time]}
                    max={24}
                    step={0.1}
                    onValueChange={(val) => setTime(val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={togglePause}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 active:bg-white/20 py-2 rounded-xl transition-colors text-xs font-medium text-white/90 border border-white/5 h-auto"
                  >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    {isPaused ? 'RESUME' : 'PAUSE'}
                  </Button>

                  <Button
                    onClick={() => setSpeed(speed === 1 ? 10 : 1)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-colors text-xs font-medium border border-white/5 h-auto',
                      speed > 1
                        ? 'bg-blue-500/20 text-blue-200 border-blue-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-white/70',
                    )}
                  >
                    <Zap
                      size={14}
                      className={cn(speed > 1 && 'fill-current')}
                    />
                    {speed > 1 ? 'TURBO' : '1x'}
                  </Button>
                </div>
              </GlassPill>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
