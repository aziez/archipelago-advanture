/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassPillProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassPill = ({ children, className, onClick }: GlassPillProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base Glass Effect
        'relative overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10 shadow-xl',
        // Shape & Interaction
        'rounded-3xl transition-all duration-300',
        // Hover effect (optional)
        onClick && 'cursor-pointer hover:bg-black/30 active:scale-95',
        className,
      )}
    >
      {/* Noise Texture Overlay (Optional for extra texture) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
