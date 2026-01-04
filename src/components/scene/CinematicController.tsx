'use client';

import { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGameStore } from '@/stores/useGameStore';
import { introSheet, cameraObj } from '@/lib/theatre'; // Import dari Lib

export const CinematicController = () => {
  const { camera } = useThree();
  const setCinematic = useGameStore((state) => state.setCinematic);
  const isCinematic = useGameStore((state) => state.isCinematic);
  const boatPositionRef = useGameStore((state) => state.boatPositionRef);

  useEffect(() => {
    if (isCinematic) {
      introSheet.sequence.position = 0;
      introSheet.sequence.play({ iterationCount: 1 }).then(() => {
        console.log('🎬 Intro Finished');
        setCinematic(false);
      });
    }
  }, [isCinematic, setCinematic]);

  useFrame(() => {
    // Hapus logika process.env agar tidak konflik dengan CameraManager
    if (isCinematic) {
      const values = cameraObj.value; // Ambil value dari Lib
      const boatPos = boatPositionRef.current;

      camera.position.set(
        boatPos.x + values.offset.x,
        boatPos.y + values.offset.y,
        boatPos.z + values.offset.z,
      );

      camera.lookAt(
        boatPos.x + values.lookAtOffset.x,
        boatPos.y + values.lookAtOffset.y,
        boatPos.z + values.lookAtOffset.z,
      );
    }
  });

  return null;
};
