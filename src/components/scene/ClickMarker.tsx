'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/stores/useGameStore';
import type * as THREE from 'three';

export const ClickMarker = () => {
  const clickTarget = useGameStore((state) => state.clickTarget);
  const ref = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!clickTarget || !ref.current || !ringRef.current) return;

    // Animasi Berputar & Naik Turun
    const t = state.clock.elapsedTime;
    ringRef.current.rotation.z += 0.05;
    ringRef.current.scale.setScalar(1 + Math.sin(t * 10) * 0.2); // Berdenyut
  });

  if (!clickTarget) return null;

  return (
    <group ref={ref} position={[clickTarget.x, 0.5, clickTarget.z]}>
      {/* Cincin Luar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} ref={ringRef}>
        <ringGeometry args={[1.5, 2, 32]} />
        <meshBasicMaterial color="white" opacity={0.5} transparent />
      </mesh>

      {/* Titik Tengah */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Garis Vertikal (Beacon) */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 10]} />
        <meshBasicMaterial color="white" opacity={0.2} transparent />
      </mesh>
    </group>
  );
};
