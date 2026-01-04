'use client';

import { useRef } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { useFrame } from '@react-three/fiber';

export const TimeManager = () => {
  const tickTime = useGameStore((state) => state.tickTime);

  // Ref untuk menampung waktu sementara
  const accumulator = useRef(0);

  useFrame((_, delta) => {
    // 1. Tumpuk delta time
    accumulator.current += delta;

    // 2. Batasi Update State!
    // Hanya update store jika akumulasi sudah lebih dari 0.05 detik (sekitar 20 FPS untuk logic)
    // Ini meringankan beban React Re-render sebesar 60-70%
    if (accumulator.current > 0.05) {
      tickTime(accumulator.current);
      accumulator.current = 0; // Reset
    }
  });

  return null;
};
