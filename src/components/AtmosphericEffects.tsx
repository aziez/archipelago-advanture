'use client';

import { Cloud, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';

export const AtmosphericEffects = () => {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    // ROTASI GRUP (Pergerakan awan melintasi langit)
    // Kita perlambat lagi dari 0.001 ke 0.0005 agar nyaris tidak terasa (subtle)
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.0005;
    }
  });

  const cloudColor = '#e0f2fe'; // Putih kebiruan lembut

  return (
    <group>
      <group ref={cloudsRef} position={[0, 60, 0]}>
        {/* OPTIMASI CLOUD:
           1. speed: Ubah ke 0.01 atau 0.02 (Biar awannya tenang, tidak 'mendidih')
           2. segments: Turunkan ke 10-20 (Biar ringan dan tidak patah-patah)
           3. growth: Tambahkan biar gumpalan tetap terlihat besar walau segment dikit
           4. opacity: Turunkan biar blending lebih halus
        */}

        {/* Awan 1 */}
        <Cloud
          seed={1} // Seed biar bentuk konsisten
          opacity={0.3}
          speed={0.02} // SANGAT PELAN (Turbulensi internal)
          growth={10} // Biar gumpalan besar-besar
          segments={15} // Hemat performa (sebelumnya 40)
          bounds={[100, 10, 100]}
          volume={30}
          position={[0, 0, -40]}
          color={cloudColor}
          fade={50} // Pinggiran halus
        />

        {/* Awan 2 */}
        <Cloud
          seed={2}
          opacity={0.3}
          speed={0.02}
          growth={8}
          segments={12} // Hemat performa
          bounds={[80, 10, 80]}
          volume={25}
          position={[-50, 5, 30]}
          color={cloudColor}
          fade={50}
        />

        {/* Awan 3 */}
        <Cloud
          seed={3}
          opacity={0.25}
          speed={0.01}
          growth={12}
          segments={10} // Hemat performa
          bounds={[80, 10, 80]}
          volume={20}
          position={[50, -5, 10]}
          color={cloudColor}
          fade={50}
        />
      </group>

      <Stars
        radius={200}
        depth={50}
        count={1500} // Turunkan drastis dari 5000 ke 1000-1500 (Gak bakal sadar bedanya)
        factor={6} // Perbesar sedikit ukuran bintangnya biar tetep kelihatan
        saturation={0}
        fade
        speed={0.5}
      />
    </group>
  );
};
