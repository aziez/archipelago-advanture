'use client';
import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  value: number;
  color?: string; // Optional, default gray
}

export const StatBar = ({
  label,
  value,
  color = 'bg-slate-500',
}: StatBarProps) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-mono text-white/70">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);
