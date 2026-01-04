'use client';

import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Float,
} from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CharacterViewerProps {
  children: React.ReactNode;
  scale?: number;
  offset?: [number, number, number];
}

export const CharacterViewer = ({
  children,
  scale = 1,
  offset = [0, -1, 0],
}: CharacterViewerProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative w-full h-full">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>

      {/* 2. CANVAS UTAMA */}
      <Canvas
        className={`transition-opacity duration-700 ease-out ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
        // Event ini dipanggil saat WebGL context berhasil dibuat
        onCreated={() => {
          // Kasih delay dikit biar shader kompilasi beres 100%
          setTimeout(() => setIsReady(true), 200);
        }}
      >
        {/* 3. SUSPENSE: Tangani loading model async */}
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={50} />

          {/* Lighting Setup Standard */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={1} />

          {/* Environment Reflection (Biar metal kelihatan bagus) */}
          <Environment preset="city" />

          {/* Content Wrapper */}
          <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            floatingRange={[-0.1, 0.1]}
          >
            <group position={offset} scale={scale}>
              {children}
            </group>
          </Float>

          <ContactShadows
            position={[0, offset[1] - 0.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
          />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
