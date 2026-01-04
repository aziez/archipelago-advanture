'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Ocean from '@/components/Ocean';
import { motion } from 'framer-motion';

// Components
import { TimeManager } from './scene/TimeManager';
import { Lighting } from './scene/Lighting';
import { SkyBox } from './scene/SkyBox';

import { GameHUD } from './ui/GameHUD';

import { useGameStore } from '@/stores/useGameStore';
import { TimeControls } from '@/components/ui/TimeControl';
import { Boat } from '@/components/Boat';
import { Collectibles } from '@/components/scene/Collectible';
import Archipelago from '@/components/Archipelago';
import { NavigationDock } from '@/components/ui/NavigationDock';
import { ISLANDS } from '@/constants/island';
import { CinematicIntro } from '@/components/ui/CinematicIntro';
import { MobileControls } from '@/components/ui/MobileControl';
import { CinematicController } from '@/components/scene/CinematicController';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { SoundManager } from '@/components/scene/SoundManager';
import { CameraManager } from '@/components/scene/CameraManager';
import { TheatreStudio } from '@/components/TheatreStudio';
import { ClickMarker } from '@/components/scene/ClickMarker';
import { PortfolioOverlay } from '@/components/portfolio-overlay';
import { Seagulls } from '@/components/scene/part/Seagulls';
import { Shark } from '@/components/scene/part/Shark';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Scene = () => {
  const { time, theme, setTargetIsland, isCinematic } = useGameStore();

  const atmosphereColors = useMemo(() => {
    const h = time;
    if (h >= 5 && h < 8)
      return { fog: '#ffccaa', bg: 'from-orange-300 to-sky-400', ambient: 0.5 };
    if (h >= 8 && h < 16)
      return { fog: '#bae6fd', bg: 'from-sky-400 to-blue-200', ambient: 0.8 };
    if (h >= 16 && h < 19)
      return {
        fog: '#ff9966',
        bg: 'from-[#ff8c00] via-[#fd5e53] to-[#2c0b4d]',
        ambient: 0.6,
      };
    return { fog: '#050a14', bg: 'from-[#0f172a] to-black', ambient: 0.1 };
  }, [time]);

  return (
    <div
      className={`w-full h-screen relative transition-colors duration-1000 bg-linear-to-b ${atmosphereColors.bg} overflow-hidden`}
    >
      <Loader dataInterpolation={(p) => `Loading World... ${p.toFixed(0)}%`} />

      <CinematicIntro />

      {/* --- UI LAYER --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isCinematic ? 0 : 1,
          pointerEvents: 'none',
        }}
        transition={{ duration: 1.5, delay: isCinematic ? 0 : 1 }}
        // Layout Utama: Flex Column untuk memisahkan Atas dan Bawah
        className="absolute inset-0 z-40 flex flex-col justify-between pointer-events-none"
      >
        {/* --- HEADER SECTION (Top Left & Top Right) --- */}
        <div className="w-full flex justify-between items-start p-4 md:p-6">
          {/* Top Left: Game Status / HUD */}
          <div className="pointer-events-auto ">
            <GameHUD />
          </div>
          <div className="pointer-events-auto ">
            <LanguageSwitcher />
          </div>

          {/* Top Right: System Controls (Time & Language) */}
          {/* Disusun vertikal (col) agar rapi di pojok kanan */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <TimeControls />
          </div>
        </div>

        {/* --- FOOTER SECTION (Controls & Dock) --- */}
        <div className="relative w-full pb-6 md:pb-8">
          {/* Layer 1: Mobile Controls (Joystick) - Z-Index Rendah */}
          {/* Posisinya absolute memenuhi area bawah agar jempol leluasa */}
          <div className="absolute inset-0 z-10">
            <MobileControls />
          </div>

          {/* Layer 2: Navigation Dock (Center Bottom) - Z-Index Tinggi */}
          {/* Supaya dock tidak tertutup joystick area */}
          <div className="relative z-20 flex justify-center pointer-events-auto px-4">
            <NavigationDock />
          </div>
        </div>
      </motion.div>

      {/* --- OVERLAY LAYER (Modal Portfolio) --- */}
      <div className="relative z-50">
        <PortfolioOverlay />
      </div>

      {/* --- 3D CANVAS LAYER --- */}
      <Canvas
        shadows
        dpr={[1, 1.5]} // Performance optimization for mobile
        className="w-full h-full"
        gl={{
          alpha: true,
          antialias: false,
          preserveDrawingBuffer: true,
          premultipliedAlpha: false,
          toneMappingExposure: theme === 'light' ? 1.1 : 0.5,
        }}
      >
        <TheatreStudio />
        <CinematicController />
        {!isCinematic && <CameraManager />}

        <Suspense fallback={null}>
          <TimeManager />
          <SoundManager />
          <Lighting />

          <SkyBox />
          <ClickMarker />
          <Boat />
          <Shark scale={0.5} />
          <Collectibles />
          <Seagulls />

          <Archipelago islands={ISLANDS} onIslandClick={setTargetIsland} />
          <Ocean theme={theme} />

          <EffectComposer resolutionScale={0.75} multisampling={0}>
            <Bloom luminanceThreshold={2} mipLevels={4} intensity={1} />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
