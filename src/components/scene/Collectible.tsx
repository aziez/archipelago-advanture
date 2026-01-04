'use client';

import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, useGLTF } from '@react-three/drei';
import { useGameStore } from '@/stores/useGameStore';

interface CrateProps {
  position: [number, number, number];
  id: number;
  boatPositionRef: React.MutableRefObject<THREE.Vector3>;
}

export const Collectibles = () => {
  // PENTING: Parent TIDAK BOLEH subscribe ke 'collectedIds'
  // Agar saat skor nambah, list ini tidak dirender ulang.
  const boatPositionRef = useGameStore((state) => state.boatPositionRef);

  const items = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 200,
        0,
        (Math.random() - 0.5) * 200,
      ] as [number, number, number],
    }));
  }, []);

  return (
    <>
      {items.map((item) => (
        <Crate
          key={item.id}
          position={item.position}
          id={item.id}
          boatPositionRef={boatPositionRef}
        />
      ))}
    </>
  );
};

const Crate = ({ position, id, boatPositionRef }: CrateProps) => {
  const { nodes, materials } = useGLTF('/3d/Barrel.glb');
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Ref untuk status lokal (biar gak perlu re-render react saat diambil)
  const isCollectedRef = useRef(false);

  const crateBasePos = useMemo(
    () => new THREE.Vector3(position[0], 0, position[2]),
    [position],
  );

  // 1. CEK STATUS AWAL (Hanya sekali saat mount)
  // Kita cek langsung ke store tanpa subscribe (getState)
  useLayoutEffect(() => {
    const isAlreadyCollected = useGameStore
      .getState()
      .collectedIds.includes(id);
    if (isAlreadyCollected && groupRef.current) {
      isCollectedRef.current = true;
      groupRef.current.visible = false;
    }
  }, [id]);

  useFrame((state) => {
    // Jika collected/hidden, hentikan kalkulasi apapun untuk objek ini (Hemat CPU)
    if (
      !groupRef.current ||
      !groupRef.current.visible ||
      isCollectedRef.current
    )
      return;

    const t = state.clock.elapsedTime;

    // --- ANIMASI VISUAL ---
    groupRef.current.rotation.y += 0.01;

    // Ring Berdenyut (Hemat kalkulasi dengan cek existence)
    if (ringRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.2;
      ringRef.current.scale.set(scale, scale, 1);
    }

    // --- LOGIC COLLISION ---
    // Gunakan distanceSquared untuk performa lebih cepat (menghindari Akar Kuadrat)
    // Jarak 5 unit = 25 unit squared
    const distSq = crateBasePos.distanceToSquared(boatPositionRef.current);

    if (distSq < 25) {
      // 5 * 5 = 25
      isCollectedRef.current = true;

      // A. HILANGKAN VISUAL SECARA LANGSUNG
      groupRef.current.visible = false;
      useGameStore.getState().addScore(id);
    }
  });

  // Material kloning agar emissive tidak merubah barrel lain
  const barrelMaterial = useMemo(() => {
    if (materials.Atlas instanceof THREE.MeshStandardMaterial) {
      const mat = materials.Atlas.clone();
      // TEKNIK EMISSIVE: Benda bercahaya tanpa lampu
      mat.emissive = new THREE.Color('#fbbf24');
      mat.emissiveIntensity = 0.1;
      return mat;
    }
    return materials.Atlas;
  }, [materials.Atlas]);

  return (
    <group position={position}>
      {/* Kurangi float intensity biar hemat physics sederhana */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={groupRef}>
          {/* HAPUS PointLight! Ganti dengan Emissive Material di atas */}

          <mesh
            // Matikan shadow cast untuk objek kecil (Hemat GPU drastis)
            castShadow={false}
            receiveShadow
            geometry={(nodes.Prop_Barrel as THREE.Mesh).geometry}
            material={barrelMaterial} // Pakai material custom
            scale={200}
            position={[0, 0.5, 0]}
          />

          {/* Indikator Ring */}
          <mesh
            ref={ringRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.1, 0]}
          >
            <ringGeometry args={[1.5, 2.0, 16]} />{' '}
            {/* Segments 16 cukup, gausah 32 */}
            <meshBasicMaterial
              color="#fbbf24"
              opacity={0.5}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

useGLTF.preload('/3d/Barrel.glb');
