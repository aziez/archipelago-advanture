'use client';

import { Canvas } from '@react-three/fiber';
import {
  Float,
  PresentationControls,
  ContactShadows,
  Environment,
  SpotLight,
  Sparkles,
} from '@react-three/drei';
import { Suspense, useEffect, useState, type ReactNode } from 'react';

// Interface biar Reusable
interface CharacterViewerProps {
  children: ReactNode; // Bisa diisi komponen apa aja
  scale?: number; // Opsional: atur besar kecil
  offset?: [number, number, number]; // Opsional: atur posisi Y
}

export const CharacterViewer = ({
  children,
  scale = 1.2,
  offset = [0, -1.2, 0],
}: CharacterViewerProps) => {
  const [isReady, setIsReady] = useState(false);

  // Lazy Load tetap dipertahankan biar ga Crash
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500/50 border-t-blue-400 rounded-full animate-spin" />
          <span className="text-[10px] text-blue-400/50 font-mono tracking-widest uppercase">
            Initializing Neural Link...
          </span>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 35 }} // FOV diperkecil biar lebih sinematik (Telephoto)
      className="h-full w-full animate-in fade-in duration-1000"
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      dpr={[1, 1.5]} // Limit pixel ratio biar performa terjaga
    >
      {/* 1. LIGHTING SETUP (MODERN LOOK) */}
      <ambientLight intensity={0.4} />

      {/* Main Light (Key Light) */}
      <SpotLight
        position={[5, 5, 5]}
        angle={0.25}
        penumbra={1}
        intensity={2}
        castShadow
        color="#ffffff"
      />

      {/* Rim Light (Backlight - Biar ada outline keren di karakter) */}
      <SpotLight
        position={[-5, 5, -5]}
        angle={0.25}
        penumbra={1}
        intensity={3}
        color="#3b82f6" // Warna biru cyber
      />

      <Environment preset="city" blur={1} />

      {/* 2. ATMOSPHERE */}
      <Sparkles
        count={30}
        scale={3}
        size={2}
        speed={0.4}
        opacity={0.4}
        color="#60a5fa"
      />

      {/* 3. CONTROLS (TACTILE FEEL) */}
      <PresentationControls
        global={false} // Hanya capture mouse di canvas ini
        cursor={true}
        speed={1.5}
        zoom={1}
        rotation={[0, -Math.PI / 6, 0]} // Sudut awal estetik
        polar={[-Math.PI / 6, Math.PI / 6]} // Batas atas bawah (jangan sampai liat kolong)
        azimuth={[-Math.PI / 3, Math.PI / 3]} // Batas kiri kanan
      >
        <Float
          speed={2}
          rotationIntensity={0.1} // Dikurangi biar ga mabok pas diem
          floatIntensity={0.5}
          floatingRange={[-0.05, 0.05]}
        >
          <Suspense fallback={null}>
            <group position={offset} scale={scale}>
              {/* RENDER APAPUN YG DIKIRIM DARI PARENT */}
              {children}
            </group>
          </Suspense>
        </Float>
      </PresentationControls>

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.6}
        scale={10}
        blur={2.5}
        far={4}
        color="#000000"
      />
    </Canvas>
  );
};
