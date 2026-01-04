'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

// Helper Texture
function createSunGlowTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 200, 100, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(canvas);
}

interface SunProps {
  time: number;
  position: [number, number, number];
}

export const Sun = ({ time, position }: SunProps) => {
  const glowTexture = useMemo(() => createSunGlowTexture(), []);

  const sunColor = useMemo(() => {
    if (time > 6 && time < 18) {
      const middayProgress = Math.abs(time - 12) / 6;
      if (middayProgress > 0.8) return new THREE.Color('#ff5500');
      if (middayProgress < 0.2) return new THREE.Color('#ffffee');
      return new THREE.Color('#ffaa00');
    }
    return new THREE.Color('#ff5500');
  }, [time]);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[25, 64, 64]} />
        <meshBasicMaterial color={sunColor} toneMapped={false} />
      </mesh>

      {glowTexture && (
        <sprite scale={[180, 180, 1]} position={[0, 0, -2]}>
          <spriteMaterial
            map={glowTexture}
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            color={sunColor}
          />
        </sprite>
      )}
    </group>
  );
};
