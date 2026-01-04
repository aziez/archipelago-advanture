'use client';

import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useGameStore } from '@/stores/useGameStore';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SoundManager = () => {
  const isMuted = useGameStore((state) => state.isMuted);
  const boatSpeedRef = useGameStore((state) => state.boatSpeedRef);
  const score = useGameStore((state) => state.score);

  const ambientRef = useRef<Howl | null>(null);
  const engineRef = useRef<Howl | null>(null);
  const sfxCollectRef = useRef<Howl | null>(null);
  const prevScore = useRef(score);

  // Variable lokal untuk menyimpan nilai terakhir (biar gak spam Howler)
  const lastVolume = useRef(0);
  const lastRate = useRef(0.5);

  // 1. SETUP SUARA
  useEffect(() => {
    ambientRef.current = new Howl({
      src: ['/sounds/ocean-ambience.mp3'],
      loop: true,
      volume: 0.3,
      autoplay: true,
      html5: true, // PENTING: Streaming audio panjang biar gak berat
    });

    engineRef.current = new Howl({
      src: ['/sounds/ship-engine.mp3'],
      loop: true,
      volume: 0,
      rate: 0.5,
      autoplay: true,
    });

    sfxCollectRef.current = new Howl({
      src: ['/sounds/pop.mp3'],
      volume: 0.6,
    });

    return () => {
      ambientRef.current?.unload();
      engineRef.current?.unload();
      sfxCollectRef.current?.unload();
    };
  }, []);

  // 2. MUTE
  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  // 3. SFX TRIGGER
  useEffect(() => {
    if (score > prevScore.current) {
      const randomRate = 0.9 + Math.random() * 0.2;
      sfxCollectRef.current?.rate(randomRate);
      sfxCollectRef.current?.play();
    }
    prevScore.current = score;
  }, [score]);

  // 4. GAME LOOP (OPTIMIZED)
  useFrame((state, delta) => {
    if (!engineRef.current) return;

    const currentSpeed = Math.abs(boatSpeedRef.current);

    // --- LOGIC VOLUME ---
    const targetVol = currentSpeed > 0.1 ? 0.5 : 0;
    // Lerp manual nilainya di JS variable, BUKAN panggil engine.volume() dulu
    const newVol = THREE.MathUtils.lerp(
      lastVolume.current,
      targetVol,
      delta * 2,
    );

    // OPTIMASI ANTI-CRASH:
    // Hanya update Howler jika perubahannya signifikan (> 0.01)
    if (Math.abs(newVol - lastVolume.current) > 0.01) {
      engineRef.current.volume(newVol);
      lastVolume.current = newVol;
    }

    // --- LOGIC PITCH / RATE ---
    const targetRate = 0.6 + (currentSpeed / 25) * 0.6;
    // Sama, update hanya jika berubah agak banyak
    if (Math.abs(targetRate - lastRate.current) > 0.02) {
      // Limit rate biar gak error (Howler range aman: 0.5 - 4.0)
      const safeRate = Math.max(0.5, Math.min(targetRate, 4.0));
      engineRef.current.rate(safeRate);
      lastRate.current = safeRate;
    }
  });

  return null;
};
