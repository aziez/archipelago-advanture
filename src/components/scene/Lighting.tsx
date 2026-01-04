'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/stores/useGameStore';
import * as THREE from 'three';

export const Lighting = () => {
  // 1. REF UNTUK AKSES LANGSUNG (TANPA RE-RENDER REACT)
  const dirLight = useRef<THREE.DirectionalLight>(null);
  const hemiLight = useRef<THREE.HemisphereLight>(null);
  const fogRef = useRef<THREE.Fog>(null);

  // Helper Warna (Reusable biar hemat memori)
  const colorSunDay = new THREE.Color('#ffffff');
  const colorSunSunset = new THREE.Color('#ffaa00');

  const colorFogDay = new THREE.Color('#dbeafe'); // Biru awan muda
  const colorFogSunset = new THREE.Color('#ffcc99'); // Orange pudar
  const colorFogNight = new THREE.Color('#050b14'); // Biru gelap banget

  const colorHemiSkyDay = new THREE.Color('#fff0dd');
  const colorHemiGroundDay = new THREE.Color('#ffaa55');
  const colorHemiSkyNight = new THREE.Color('#1a2d38');
  const colorHemiGroundNight = new THREE.Color('#000000');

  useFrame(() => {
    // 2. AMBIL WAKTU LANGSUNG DARI STATE (Ringan)
    const time = useGameStore.getState().time;

    // --- A. UPDATE POSISI MATAHARI (SAMA DENGAN SKYBOX) ---
    // Rumus: (time / 24) * 2 * PI - PI/2
    const radius = 1000;
    const theta = (time / 24) * Math.PI * 2;
    const offset = -Math.PI / 2;

    const x = Math.cos(theta + offset) * radius;
    const y = Math.sin(theta + offset) * radius;
    const z = -200; // Miring ke selatan

    if (dirLight.current) {
      dirLight.current.position.set(x, y, z);
    }

    // --- B. LOGIC FASE WAKTU (Smooth Transition) ---
    // Kita buat transisi halus (Lerping)

    const isDay = time > 6 && time < 18;
    const isSunset = (time > 5 && time <= 6) || (time >= 17 && time < 18.5);
    const isNight = !isDay && !isSunset;

    // --- C. UPDATE WARNA & INTENSITAS SECARA REALTIME ---

    // 1. DIRECTIONAL LIGHT (MATAHARI)
    if (dirLight.current) {
      if (isDay && !isSunset) {
        // Siang Bolong
        dirLight.current.color.lerp(colorSunDay, 0.1);
        dirLight.current.intensity = THREE.MathUtils.lerp(
          dirLight.current.intensity,
          2.5,
          0.05,
        );
      } else if (isSunset) {
        // Sore/Pagi (Golden Hour)
        dirLight.current.color.lerp(colorSunSunset, 0.1);
        dirLight.current.intensity = THREE.MathUtils.lerp(
          dirLight.current.intensity,
          1.5,
          0.05,
        );
      } else {
        // Malam
        dirLight.current.intensity = THREE.MathUtils.lerp(
          dirLight.current.intensity,
          0,
          0.05,
        );
      }
    }

    // 2. FOG (KABUT)
    if (fogRef.current) {
      if (isDay && !isSunset) {
        fogRef.current.color.lerp(colorFogDay, 0.02);
      } else if (isSunset) {
        fogRef.current.color.lerp(colorFogSunset, 0.05);
      } else {
        fogRef.current.color.lerp(colorFogNight, 0.05);
      }
    }

    // 3. HEMISPHERE LIGHT (AMBIENT)
    if (hemiLight.current) {
      if (isNight) {
        hemiLight.current.color.lerp(colorHemiSkyNight, 0.05);
        hemiLight.current.groundColor.lerp(colorHemiGroundNight, 0.05);
        hemiLight.current.intensity = THREE.MathUtils.lerp(
          hemiLight.current.intensity,
          0.2,
          0.05,
        );
      } else {
        hemiLight.current.color.lerp(colorHemiSkyDay, 0.05);
        hemiLight.current.groundColor.lerp(colorHemiGroundDay, 0.05);
        hemiLight.current.intensity = THREE.MathUtils.lerp(
          hemiLight.current.intensity,
          0.8,
          0.05,
        );
      }
    }
  });

  return (
    <>
      {/* Fog attach="fog" otomatis nempel ke scene */}
      <fog ref={fogRef} attach="fog" args={['#dbeafe', 10, 450]} />

      <hemisphereLight
        ref={hemiLight}
        intensity={0.8}
        // Warna awal (akan diupdate useFrame)
        color="#fff0dd"
        groundColor="#ffaa55"
      />

      <directionalLight
        ref={dirLight}
        // Posisi awal
        position={[100, 100, -50]}
        intensity={2.5}
        castShadow={false}
        shadow-bias={-0.0005}
        // Shadow map resolution (Jaga di 1024 atau 2048 biar performa aman)
        shadow-mapSize={[1024, 1024]}
      >
        {/* Shadow Camera diatur fix agar mencakup area permainan */}
        <orthographicCamera
          attach="shadow-camera"
          args={[-150, 150, 150, -150]}
          far={2000}
        />
      </directionalLight>

      {/* Shadow Tanah (Fake Shadow untuk kapal agar menapak air) */}
      {/* <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={60} // Diperbesar dikit biar cover area lebih luas
        blur={2.5}
        far={10}
        frames={1} // Render sekali saja (Statis) atau frames={0} kalau mau manual
        color="#000000"
      /> */}
    </>
  );
};
