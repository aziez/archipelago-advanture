/** biome-ignore-all lint/a11y/noStaticElementInteractions: <noStaticElementInteractions> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <noExplicitAny> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <useKeyWithClickEvents> */
'use client';

import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Html, useCursor, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Imports Models & Logic
import type { IslandData } from '@/stores/useGameStore';
import { HomeIsland } from '@/components/scene/island/HomeIsland';
import { SkillsIsland } from '@/components/scene/island/SkillsIsland';
import { ContactIsland } from '@/components/scene/island/ContactIsland';
import { PlaneBeach } from '@/components/scene/part/Plane';
import { ProjectIsland } from '@/components/scene/island/ProjectIsland';

// IMPORT WRAPPER
import { TheatreObject } from '@/components/scene/TheatreObject';
import { ArrowRightCircle } from 'lucide-react';
import { IconComponents } from '@tabler/icons-react';

// NEW: Import i18n Hook
import { useTranslations } from 'next-intl';

// SETTINGS
const DEBUG_MODE = false;
const COLLISION_RADIUS = 35;

interface ArchipelagoProps {
  islands: IslandData[];
  onIslandClick: (island: IslandData) => void;
}

// 1. OPTIMASI: Bungkus Component Utama dengan memo
const Archipelago = memo(({ islands, onIslandClick }: ArchipelagoProps) => {
  return (
    <group>
      {islands.map((island, index) => (
        <EditableIsland
          key={island.id}
          index={index}
          data={island}
          onClick={() => onIslandClick(island)}
        />
      ))}
    </group>
  );
});

Archipelago.displayName = 'Archipelago';

// Helper Component untuk memilih Model (Dipisah biar bersih)
const IslandModelSelector = ({ id }: { id: string }) => {
  switch (id) {
    case 'home':
      return <HomeIsland />;
    case 'skills':
      return <SkillsIsland />;
    case 'contact':
      return <ContactIsland />;
    case 'projects':
    case 'resume':
      return <ProjectIsland />;
    default:
      return <PlaneBeach />;
  }
};

// 2. OPTIMASI: Bungkus Child Component dengan memo
const EditableIsland = memo(
  ({
    data,
    index,
    onClick,
  }: {
    data: IslandData;
    index: number;
    onClick: () => void;
  }) => {
    // 3. Panggil Hook Translation (Namespace 'Islands')
    const t = useTranslations('Islands');

    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    // Ref untuk Animasi Pop-Up
    const revealRef = useRef<THREE.Group>(null);
    const currentScale = useRef(0);
    const targetScale = useRef(0);
    const isAnimating = useRef(true); // Flag untuk stop useFrame

    // Tinggi Label
    const labelHeight = useMemo(() => {
      switch (data.id) {
        case 'home':
          return 15;
        case 'resume':
        case 'skills':
          return 20;
        case 'contact':
          return 2;
        case 'projects':
          return 10;
        default:
          return 22;
      }
    }, [data.id]);

    // Trigger Animasi Start (Staggered)
    useEffect(() => {
      const delay = 500 + index * 200;
      const timeout = setTimeout(() => {
        targetScale.current = 1;
        isAnimating.current = true;
      }, delay);
      return () => clearTimeout(timeout);
    }, [index]);

    // Animation Loop (Optimized)
    useFrame((_state, delta) => {
      if (!isAnimating.current || !revealRef.current) return;

      const speed = 6;
      currentScale.current = THREE.MathUtils.lerp(
        currentScale.current,
        targetScale.current,
        speed * delta,
      );

      revealRef.current.scale.setScalar(currentScale.current);

      if (Math.abs(targetScale.current - currentScale.current) < 0.001) {
        revealRef.current.scale.setScalar(targetScale.current);
        isAnimating.current = false;
      }
    });

    // 4. OPTIMASI: Memoize Model 3D
    const islandModel = useMemo(
      () => <IslandModelSelector id={data.id} />,
      [data.id],
    );

    return (
      <group
        position={data.position}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* DEBUG MODE */}
        {DEBUG_MODE && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
            <ringGeometry
              args={[COLLISION_RADIUS - 0.5, COLLISION_RADIUS, 32]}
            />
            <meshBasicMaterial color="red" wireframe />
          </mesh>
        )}

        <TheatreObject id={`Island Visual: ${data.id}`} position={[0, 0, 0]}>
          <group ref={revealRef} scale={0}>
            {/* Render Model */}
            {islandModel}

            {/* LIGHTING */}
            <pointLight
              position={[0, 15, 0]}
              intensity={2}
              distance={40}
              color={data.themeColor || 'white'}
              decay={2}
              castShadow={false}
            />

            {/* UI LABEL */}
            <group position={[0, labelHeight, 0]}>
              <Float
                speed={2}
                rotationIntensity={0}
                floatIntensity={1}
                floatingRange={[-0.5, 0.5]}
              >
                <Html
                  center
                  distanceFactor={100}
                  zIndexRange={[0, 0]}
                  transform
                  sprite
                  style={{
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    opacity: isAnimating.current ? 0 : 1,
                    transition: 'opacity 0.5s',
                  }}
                >
                  <div
                    className="pointer-events-auto group cursor-pointer flex flex-col items-center transition-transform duration-300 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <div
                      className={`
                        relative flex items-center gap-3 px-5 py-3 rounded-2xl 
                        border-l-8 shadow-lg backdrop-blur-md transition-all duration-300 ease-out
                        ${
                          hovered
                            ? 'bg-slate-900/95 -translate-y-2'
                            : 'bg-slate-900/80'
                        }
                      `}
                      style={{
                        borderColor: data.themeColor || '#ffffff',
                        boxShadow: hovered
                          ? `0 0 20px ${data.themeColor}40`
                          : '0 5px 10px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white"
                        style={{ color: data.themeColor || 'white' }}
                      >
                        {/* @ts-ignore */}
                        <IconComponents size={20} strokeWidth={2.5} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white font-bold font-sans text-lg tracking-wide uppercase leading-none">
                          {t(data.id as any)}
                        </span>

                        <div className="h-4 overflow-hidden relative mt-1">
                          <div
                            className={`flex flex-col transition-transform duration-300 ${
                              hovered ? '-translate-y-4' : 'translate-y-0'
                            }`}
                          >
                            <span
                              className="text-[10px] font-bold tracking-widest uppercase opacity-80"
                              style={{ color: data.themeColor }}
                            >
                              Locked
                            </span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-white flex items-center gap-1">
                              Warp <ArrowRightCircle size={10} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Anchor Line Simple */}
                    <div className="flex flex-col items-center -mt-px">
                      <div
                        className={`w-0.5 bg-white/50 transition-all duration-300 ${
                          hovered ? 'h-6 opacity-100' : 'h-3 opacity-30'
                        }`}
                      />
                      <div
                        className={`w-2 h-2 rounded-full bg-white transition-all duration-300 ${
                          hovered ? 'scale-100' : 'scale-0'
                        }`}
                      />
                    </div>
                  </div>
                </Html>
              </Float>
            </group>
          </group>

          {/* HOVER RING */}
          <mesh
            position={[0, 0.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            visible={hovered}
          >
            <ringGeometry
              args={[COLLISION_RADIUS + 2, COLLISION_RADIUS + 3, 32]}
            />
            <meshBasicMaterial
              color={data.themeColor || 'yellow'}
              opacity={0.3}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        </TheatreObject>
      </group>
    );
  },
);

EditableIsland.displayName = 'EditableIsland';

export default Archipelago;
