/** biome-ignore-all lint/suspicious/noExplicitAny: <noExplicitAny> */
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { BirdAnimated } from '@/components/scene/part/Bird';

const OrbitingBird = ({
  center = [0, 0, 0],
  radius = 40,
  height = 30,
  speed = 0.5,
  offset = 0,
  scale = 0.25,
}: any) => {
  const groupRef = useRef<THREE.Group>(null);

  // Randomizer statis (dihitung sekali)
  const bobSpeed = useMemo(() => 0.5 + Math.random() * 0.5, []);
  const radiusOffset = useMemo(() => Math.random() * 8 - 4, []);
  const heightOffset = useMemo(() => Math.random() * 6 - 3, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // --- FIX PATAH-PATAH & DIPERCEPAT ---
    // 1. Gunakan ElapsedTime Global (Paling Stabil)
    // 2. Kurangi Speed Faktor (Mungkin 0.3 terlalu cepat untuk radius kecil)

    const time = state.clock.getElapsedTime();

    // Rumus Orbit Linear:
    // Sudut = (Waktu * Kecepatan) + Offset Awal
    const angle = time * speed + offset;

    // --- POSISI ---
    const finalRadius = radius + radiusOffset;
    const x = center[0] + Math.sin(angle) * finalRadius;
    const z = center[2] + Math.cos(angle) * finalRadius;

    // Floating
    const y = height + heightOffset + Math.sin(time * bobSpeed) * 2;

    groupRef.current.position.set(x, y, z);

    // --- ROTASI ---
    // Rotasi mengikuti garis singgung lingkaran (Tangent)
    // Math.PI digunakan untuk membalik arah jika modelnya mundur
    groupRef.current.rotation.y = angle + Math.PI / 2 + Math.PI;

    // Banking halus
    groupRef.current.rotation.z = Math.sin(time * 2) * 0.1;
  });

  return (
    <group ref={groupRef} frustumCulled={false}>
      {/* Culling Jarak Jauh dihandle di dalam BirdAnimated */}
      <BirdAnimated scale={scale} />
    </group>
  );
};

const Flock = ({ count = 3, center, radius, height, speed }: any) => {
  // Array burung statis
  const birds = useMemo(() => new Array(count).fill(0), [count]);

  return (
    <>
      {birds.map((_, i) => (
        <OrbitingBird
          key={i as number}
          center={center}
          radius={radius}
          height={height}
          speed={speed}
          offset={(i / count) * Math.PI * 2}
        />
      ))}
    </>
  );
};

export const Seagulls = () => {
  return (
    <group>
      {/* Home Island - PERLAMBAT SPEED DI SINI */}
      <Flock
        count={3}
        center={[-100, 0, 150]}
        radius={35}
        height={25}
        speed={0.15} // Turunkan dari 0.3 ke 0.15 (Biar smooth relax)
      />

      {/* Skills Island */}
      <Flock
        count={3} // Kurangi jumlah burung jika masih berat
        center={[180, 0, 0]}
        radius={45}
        height={55}
        speed={0.12}
      />

      {/* Projects Island */}
      <Flock
        count={3}
        center={[0, 0, -150]}
        radius={40}
        height={30}
        speed={0.18}
      />

      {/* Global Flock (Jauh) */}
      <Flock
        count={4}
        center={[0, 0, 0]}
        radius={300}
        height={80}
        speed={0.04} // Sangat pelan
      />
    </group>
  );
};
