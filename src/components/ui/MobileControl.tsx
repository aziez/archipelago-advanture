/** biome-ignore-all lint/a11y/useButtonType: <useButtonType> */
'use client';

import { Joystick } from 'react-joystick-component';
import { useGameStore } from '@/stores/useGameStore';
import { Zap } from 'lucide-react';
import type { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';

export const MobileControls = () => {
  const setMobileInput = useGameStore((state) => state.setMobileInput);
  const setMobileTurbo = useGameStore((state) => state.setMobileTurbo);
  const mobileInput = useGameStore((state) => state.mobileInput);

  const handleMove = (event: IJoystickUpdateEvent) => {
    // Event y dari joystick biasanya keatas positif, tapi kita pastikan
    // x: -1 (Left) to 1 (Right)
    // y: -1 (Bottom) to 1 (Top)
    setMobileInput(event.x ?? 0, event.y ?? 0);
  };

  const handleStop = () => {
    setMobileInput(0, 0);
  };

  return (
    // Hanya muncul di Mobile (md:hidden)
    <div className="fixed inset-0 z-30 pointer-events-none md:hidden flex flex-col justify-end pb-8 px-6">
      <div className="flex justify-between items-end w-full">
        {/* JOYSTICK (KIRI) */}
        <div className="pointer-events-auto opacity-60 hover:opacity-100 transition-opacity">
          <Joystick
            size={100}
            sticky={false}
            baseColor="rgba(0,0,0, 0.3)"
            stickColor="rgba(255,255,255, 0.5)"
            move={handleMove}
            stop={handleStop}
          />
        </div>

        {/* TURBO BUTTON (KANAN) */}
        <div className="pointer-events-auto pb-2">
          <button
            onTouchStart={() => setMobileTurbo(true)}
            onTouchEnd={() => setMobileTurbo(false)}
            // Mouse events buat testing di desktop mode mobile
            onMouseDown={() => setMobileTurbo(true)}
            onMouseUp={() => setMobileTurbo(false)}
            className={`
                    w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center
                    transition-all duration-200 active:scale-95
                    ${
                      mobileInput.isTurbo
                        ? 'bg-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]'
                        : 'bg-black/30 text-white/50'
                    }
                `}
          >
            <Zap
              size={28}
              fill={mobileInput.isTurbo ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
