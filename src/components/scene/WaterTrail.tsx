/** biome-ignore-all lint/suspicious/noArrayIndexKey: <noArrayIndexKey> */
'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// --- 1. TEXTURE GENERATOR ---
function createFoamTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

type Particle = {
  active: boolean;
  life: number;
  x: number;
  z: number;
  scale: number;
  rotation: number;
  speed: number;
};

export const WaterTrail = ({ isMoving }: { isMoving: boolean }) => {
  const COUNT = 40; // Jumlah partikel diperbanyak sedikit biar padat
  const foamTexture = useMemo(() => createFoamTexture(), []);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const particles = useRef<Particle[]>(
    Array.from({ length: COUNT }, () => ({
      active: false,
      life: 0,
      x: 0,
      z: 0,
      scale: 0,
      rotation: 0,
      speed: 0,
    })),
  );

  const spawnTimer = useRef(0);

  useFrame((_state, delta) => {
    // --- 1. SPAWN LOGIC ---
    if (isMoving) {
      spawnTimer.current += delta;
      if (spawnTimer.current > 0.04) {
        // Spawn rate
        spawnTimer.current = 0;

        const deadParticle = particles.current.find((p) => !p.active);

        if (deadParticle) {
          deadParticle.active = true;
          deadParticle.life = 1.0;

          // --- PERBAIKAN POSISI DI SINI ---
          // X: Random kiri-kanan sedikit
          deadParticle.x = (Math.random() - 0.5) * 1.5;

          // Z: Ubah ke NEGATIF agar muncul di BELAKANG kapal
          // Sesuaikan angka -6.5 ini dengan panjang kapalmu.
          // Semakin minus (-), semakin mundur ke belakang.
          deadParticle.z = -2.5;

          deadParticle.scale = 0.8 + Math.random() * 0.8;
          deadParticle.rotation = Math.random() * Math.PI;
        }
      }
    }

    // --- 2. UPDATE LOGIC ---
    particles.current.forEach((p, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      if (p.active) {
        p.life -= delta * 0.6; // Umur partikel

        if (p.life <= 0) {
          p.active = false;
          mesh.visible = false;
        } else {
          mesh.visible = true;

          // Gerakan: Mundur terus ke arah Negatif Z (Menjauh dari kapal)
          p.z -= delta * 5;

          // Melebar ke samping (V-Shape)
          p.x += (p.x > 0 ? 1 : -1) * delta * 0.5;

          // Update posisi mesh
          // Y = 0.2 agar di atas air
          mesh.position.set(p.x, 0.2, p.z);

          // Efek visual membesar & memudar
          const currentScale = p.scale * (2.0 - p.life);
          mesh.scale.setScalar(currentScale);
          mesh.rotation.z = p.rotation;

          const opacity = Math.min(p.life, 1.0) * 0.5;
          if (mesh.material instanceof THREE.Material) {
            (mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
          }
        }
      } else {
        mesh.visible = false;
      }
    });
  });

  return (
    <group>
      {particles.current.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={foamTexture}
            transparent
            color="#ffffff"
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};
