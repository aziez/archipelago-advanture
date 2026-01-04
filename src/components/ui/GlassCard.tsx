'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

// Kita bungkus pakai motion.div biar bisa animasi masuk/keluar
export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        // Base styles
        'relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl',
        // Glassmorphism effect (Kunci utamanya di sini)
        'bg-white/10 dark:bg-black/20 backdrop-blur-md',
        // Hover effect
        'hover:bg-white/15 hover:border-white/20 transition-colors duration-300',
        className,
      )}
    >
      {/* Efek kilau (Noise/Gradient) opsional biar makin mahal */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative z-10 p-4">{children}</div>
    </motion.div>
  );
};
