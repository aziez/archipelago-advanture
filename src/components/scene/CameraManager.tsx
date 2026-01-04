'use client';

import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '@/stores/useGameStore';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export const CameraManager = () => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Ambil Data dari Store
  const boatPositionRef = useGameStore((state) => state.boatPositionRef);
  const boatRotationRef = useGameStore((state) => state.boatRotationRef);
  const boatSpeedRef = useGameStore((state) => state.boatSpeedRef);
  const isCinematic = useGameStore((state) => state.isCinematic);

  // Reusable Vector
  const _idealOffset = new THREE.Vector3();
  const _idealLookAt = new THREE.Vector3();

  // Flags untuk inisialisasi & transisi
  const isInitialized = useRef(false);
  const transitionTime = useRef(0);

  useFrame((_state, delta) => {
    // 1. Reset Logic jika masuk mode Cinematic
    if (isCinematic) {
      isInitialized.current = false;
      transitionTime.current = 0;
      if (controlsRef.current) controlsRef.current.enabled = false;
      return;
    }

    if (!controlsRef.current) return;

    const boatPos = boatPositionRef.current;

    // --- 2. LOGIC INISIALISASI (FIX GLITCH KIRI) ---
    // Pada frame pertama setelah Cinematic mati, kita paksa target langsung ke kapal
    // Jangan pakai LERP disini, harus instant copy!
    if (!isInitialized.current) {
      // Set target controls tepat di kapal (agak naik dikit)
      controlsRef.current.target.copy(boatPos).add(new THREE.Vector3(0, 5, 0));

      // Update controls manual agar kamera langsung 'lock' ke kapal frame ini juga
      controlsRef.current.update();

      isInitialized.current = true;
      controlsRef.current.enabled = true;
      return; // Skip logic lain di frame pertama ini biar stabil
    }

    // --- 3. LOGIC TRANSISI HALUS (SMOOTH HANDOVER) ---
    // Naikkan timer transisi (0 -> 1 dalam 3 detik)
    transitionTime.current = THREE.MathUtils.clamp(
      transitionTime.current + delta * 0.3,
      0,
      1,
    );

    // Lerp Speed: Mulai pelan (0.1) -> Cepat (5.0) seiring waktu
    // Ini mencegah kamera "membanting" posisi saat baru mulai
    const dynamicLerp = THREE.MathUtils.lerp(0.1, 5.0, transitionTime.current);

    const speed = Math.abs(boatSpeedRef.current);
    const boatRot = boatRotationRef.current;

    // --- 4. UPDATE TARGET (Fokus Kamera) ---
    // Target selalu nempel di kapal (+5m Y)
    _idealLookAt.copy(boatPos).add(new THREE.Vector3(0, 5, 0));
    // Lerp target agar pergerakan 'leher' kamera halus
    controlsRef.current.target.lerp(_idealLookAt, 10 * delta);

    // --- 5. UPDATE POSISI KAMERA (Follow) ---
    // Jika kapal jalan ATAU transisi belum selesai (< 1)
    if (speed > 0.5 || transitionTime.current < 1) {
      // Hitung posisi ideal: 30m di belakang, 12m di atas
      // Z minus (-30) karena kita mau di belakang
      _idealOffset.set(0, 12, -30);

      // Putar offset sesuai arah kapal
      _idealOffset.applyQuaternion(boatRot);

      // Tambahkan ke posisi kapal
      _idealOffset.add(boatPos);

      // Pindahkan kamera
      // Gunakan dynamicLerp: Awalnya sangat pelan (smooth), lalu jadi responsif
      camera.position.lerp(_idealOffset, dynamicLerp * delta);
    }

    // Wajib update controls
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping={false}
      minDistance={15}
      maxDistance={80}
      maxPolarAngle={Math.PI / 2 - 0.05}
    />
  );
};
