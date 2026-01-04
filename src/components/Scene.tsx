'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Stats } from '@react-three/drei';
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
      className={`w-full h-screen relative transition-colors duration-1000 bg-linear-to-b ${atmosphereColors.bg}`}
    >
      <Loader dataInterpolation={(p) => `Loading World... ${p.toFixed(0)}%`} />
      <CinematicIntro />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isCinematic ? 0 : 1, // Hilang saat cinematic, muncul saat selesai
          pointerEvents: 'none', // Agar tidak bisa diklik saat invisible
        }}
        transition={{ duration: 1.5, delay: isCinematic ? 0 : 1 }}
        className="absolute inset-0 z-40 pointer-events-none"
      >
        <div className="pointer-events-auto">
          <TimeControls />
        </div>

        <MobileControls />

        <div className="pointer-events-auto">
          <NavigationDock />
        </div>

        <div className="pointer-events-auto">
          <GameHUD />
        </div>

        {/* <ControlsHelp /> */}
      </motion.div>
      <div className="relative z-50">
        <PortfolioOverlay />
      </div>
      <Canvas
        shadows
        dpr={[1, 1.5]}
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

          <Stats />

          <SkyBox />
          <ClickMarker />
          <Boat />
          <Shark scale={0.5} />
          <Collectibles />

          <Seagulls />

          <Archipelago islands={ISLANDS} onIslandClick={setTargetIsland} />
          <Ocean theme={theme} />

          <EffectComposer resolutionScale={0.75} multisampling={0}>
            <Bloom
              luminanceThreshold={2} // Naikkan threshold biar cuma matahari yg glow
              mipLevels={4} // Turunkan dari 9 ke 4 (Glow jadi kurang halus dikit, tapi jauh lebih ringan)
              intensity={1}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
