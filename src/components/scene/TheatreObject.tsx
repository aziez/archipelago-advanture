/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <useExhaustiveDependencies> */
'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { types } from '@theatre/core';
import { levelSheet } from '@/lib/theatre';

interface TheatreObjectProps {
  id: string;
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  visible?: boolean;
}

export const TheatreObject = ({
  id,
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0], // Default 0
  scale = 1,
  visible = true,
}: TheatreObjectProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Helper: Konversi Radian <-> Degree
  const toDeg = (rad: number) => THREE.MathUtils.radToDeg(rad);
  const toRad = (deg: number) => THREE.MathUtils.degToRad(deg);

  useEffect(() => {
    // 1. Setup Initial Posisi di Ref (Hanya sekali saat mount)
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      groupRef.current.rotation.set(...rotation);
      groupRef.current.scale.setScalar(scale);
    }

    // 2. Buat Object Theatre
    const obj = levelSheet.object(
      id,
      {
        position: types.compound({
          x: types.number(position[0], { nudgeMultiplier: 0.1 }),
          y: types.number(position[1], { nudgeMultiplier: 0.1 }),
          z: types.number(position[2], { nudgeMultiplier: 0.1 }),
        }),
        // UBAH KE DEGREE AGAR EDITOR NYAMAN (Range -360 sampai 360)
        rotation: types.compound({
          x: types.number(toDeg(rotation[0]), { range: [-360, 360] }),
          y: types.number(toDeg(rotation[1]), { range: [-360, 360] }),
          z: types.number(toDeg(rotation[2]), { range: [-360, 360] }),
        }),
        scale: types.number(scale, { nudgeMultiplier: 0.1 }),
        visible: types.boolean(visible),
      },
      { reconfigure: true },
    );

    // 3. Listen Perubahan (Looping Theatre)
    const unsubscribe = obj.onValuesChange((values) => {
      if (groupRef.current) {
        groupRef.current.position.set(
          values.position.x,
          values.position.y,
          values.position.z,
        );

        // KONVERSI BALIK DARI DEGREE (Theatre) KE RADIAN (Three.js)
        groupRef.current.rotation.set(
          toRad(values.rotation.x),
          toRad(values.rotation.y),
          toRad(values.rotation.z),
        );

        groupRef.current.scale.setScalar(values.scale);
        groupRef.current.visible = values.visible;
      }
    });

    return unsubscribe;
  }, [id]);

  return (
    <group
      ref={groupRef}
      // PENTING: Jangan pasang prop position/rotation/scale disini lagi!
      // Biarkan useEffect dan Theatre yang mengontrol ref sepenuhnya.
      // Ini mencegah React me-reset rotasi setiap kali render.
    >
      {children}
    </group>
  );
};
