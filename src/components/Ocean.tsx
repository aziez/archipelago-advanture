/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <noStaticElementInteractions> */
/** biome-ignore-all lint/correctness/noUnusedVariables: <noUnusedVariables> */
/** biome-ignore-all assist/source/organizeImports: <organizeImports> */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <noUnusedFunctionParameters> */
/** biome-ignore-all lint/complexity/useLiteralKeys: <useLiteralKeys> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <noExplicitAny> */
'use client';

import { useRef, useEffect, useMemo, type FC } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three-stdlib';
import { extend } from '@react-three/fiber';
import { useGameStore } from '@/stores/useGameStore';

extend({ Water });

interface OceanProps {
  theme: 'light' | 'dark';
}

const THEME_CONFIG = {
  light: {
    sunColor: new THREE.Color('#ffebd9'),
    waterColor: new THREE.Color('#006994'),
  },
  dark: {
    sunColor: new THREE.Color('#1a1a1a'),
    waterColor: new THREE.Color('#020409'),
  },
};

const Ocean: FC<OceanProps> = ({ theme }) => {
  const ref = useRef<THREE.Mesh>(null);
  const waterRef = useRef<any>(null);
  const { scene } = useThree();
  const gl = useLoader(THREE.TextureLoader, '/waternormals.jpg');

  // 1. Ambil Action dari Store
  const setClickTarget = useGameStore((state) => state.setClickTarget);

  const waterNormals = useMemo(() => {
    gl.wrapS = gl.wrapT = THREE.RepeatWrapping;
    return gl;
  }, [gl]);

  useEffect(() => {
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  }, [waterNormals]);

  const config = useMemo(() => THEME_CONFIG[theme], [theme]);

  useEffect(() => {
    if (ref.current) {
      const water = new Water(ref.current.geometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals,
        sunDirection: new THREE.Vector3(),
        sunColor: config.sunColor,
        waterColor: config.waterColor,
        distortionScale: 3.7,
        fog: scene.fog !== undefined,
      });

      water.material.uniforms.size.value = 10.0;

      waterRef.current = water;
      ref.current.material = water.material;
      ref.current.add(water);
    }
  }, [scene, waterNormals, config.waterColor, config.sunColor]);

  useEffect(() => {
    if (waterRef.current) {
      waterRef.current.material.uniforms['sunColor'].value.copy(
        config.sunColor,
      );
      waterRef.current.material.uniforms['waterColor'].value.copy(
        config.waterColor,
      );
    }
  }, [config]);

  useFrame((state, delta) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms['time'].value += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={ref}
      rotation-x={-Math.PI / 2}
      position={[0, -0.8, 0]}
      // --- 2. IMPLEMENTASI CLICK TO MOVE ---
      onClick={(e) => {
        e.stopPropagation(); // Mencegah klik tembus ke objek lain (jika ada)
        setClickTarget(e.point); // Kirim koordinat 3D (Vector3) ke Store
        // console.log("Moving to:", e.point); // Uncomment untuk debug
      }}
      // --- 3. VISUAL FEEDBACK KURSOR ---
      onPointerEnter={() => {
        document.body.style.cursor = 'crosshair';
      }} // Ubah kursor jadi bidikan
      onPointerLeave={() => {
        document.body.style.cursor = 'auto';
      }} // Balikin kursor normal
    >
      <planeGeometry args={[10000, 10000, 64, 64]} />{' '}
    </mesh>
  );
};

export default Ocean;
