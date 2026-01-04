/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <useExhaustiveDependencies> */
/** biome-ignore-all lint/style/useConst: <useConst> */
'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, Text } from '@react-three/drei';
import { WaterTrail } from '@/components/scene/WaterTrail';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useGameStore } from '@/stores/useGameStore';
import { ISLANDS } from '@/constants/island';
import { TheatreObject } from '@/components/scene/TheatreObject';

export const Boat = () => {
  const group = useRef<THREE.Group>(null);
  const visualRef = useRef<THREE.Group>(null);

  const { nodes, materials } = useGLTF('/3d/Ship.glb');
  const { forward, backward, left, right, shift } = useKeyboard();
  const mobileInput = useGameStore((state) => state.mobileInput);

  // Store Actions & State
  const setTargetIsland = useGameStore((state) => state.setTargetIsland);
  const targetIsland = useGameStore((state) => state.targetIsland);

  // NEW: Click Target State
  const clickTarget = useGameStore((state) => state.clickTarget);
  const setClickTarget = useGameStore((state) => state.setClickTarget);

  const isManual = useGameStore((state) => state.isManual);
  const setIsManual = useGameStore((state) => state.setIsManual);
  const boatPositionRef = useGameStore((state) => state.boatPositionRef);
  const activeModal = useGameStore((state) => state.activeModal);
  const boatSpeedRef = useGameStore((state) => state.boatSpeedRef);
  const boatRotationRef = useGameStore((state) => state.boatRotationRef);
  const openModal = useGameStore((state) => state.openModal);

  const isCinematic = useGameStore((state) => state.isCinematic);
  const setCinematic = useGameStore((state) => state.setCinematic);

  // SETTINGS RADIUS
  const COLLISION_RADIUS = 34;
  const DOCKING_TRIGGER_RADIUS = 45;
  const INITIAL_SHEEP = -230;

  const [currentPos] = useState(new THREE.Vector3(INITIAL_SHEEP, 0, 90));
  const [isMoving, setIsMoving] = useState(false);
  const speedRef = useRef(0);
  const [rotationVelocity] = useState({ value: 0 });
  const [yaw] = useState({ value: Math.PI / 2 });
  const bankAngle = useRef(0);
  const lastVisitedIsland = useRef<string | null>(null);

  // Ref untuk Transisi Cinematic
  const lastCinematicState = useRef(isCinematic);

  // Deteksi Input Manual
  const isInputActive = useMemo(() => {
    if (forward || backward || left || right || shift) return true;
    if (
      Math.abs(mobileInput.x) > 0.1 ||
      Math.abs(mobileInput.y) > 0.1 ||
      mobileInput.isTurbo
    )
      return true;
    return false;
  }, [forward, backward, left, right, shift, mobileInput]);

  useEffect(() => {
    if (isCinematic) {
      const homeBase = ISLANDS.find((i) => i.id === 'home');
      if (homeBase) setTargetIsland(homeBase);
    }
  }, []);

  // Jika User menekan tombol manual, batalkan semua auto pilot
  useEffect(() => {
    if (isInputActive) {
      if (isCinematic) setCinematic(false);
      if (targetIsland) setTargetIsland(null);
      if (clickTarget) setClickTarget(null); // Batalkan click move
      if (!isManual) setIsManual(true);
    }
  }, [isInputActive]);

  // Sync Physics sesudah Cinematic selesai
  useFrame(() => {
    if (lastCinematicState.current && !isCinematic) {
      if (group.current) {
        currentPos.copy(group.current.position);
        const rotation = new THREE.Euler().setFromQuaternion(
          group.current.quaternion,
        );
        yaw.value = rotation.y;
        rotationVelocity.value = 0;
      }
    }
    lastCinematicState.current = isCinematic;
  });

  useFrame((state, delta) => {
    if (!group.current || !visualRef.current) return;
    const safeDelta = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;

    // 1. UPDATE REFS
    boatSpeedRef.current = speedRef.current;
    boatPositionRef.current.copy(currentPos);
    group.current.position.copy(currentPos);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw.value);
    boatRotationRef.current.copy(quaternion);

    // Variabel untuk menampung posisi selanjutnya
    let nextPos = currentPos.clone();
    let isAutoPilotCollision = false;

    // --- 2. LOGIC MOVEMENT ---

    // A. MANUAL
    if (isManual) {
      const isTurbo = shift || mobileInput.isTurbo;
      const maxSpeed = isTurbo ? 25 : 12;
      const acceleration = isTurbo ? 15 : 8;

      let throttle = 0;
      if (forward) throttle += 1;
      if (backward) throttle -= 1;
      if (Math.abs(mobileInput.y) > 0.1) throttle += mobileInput.y;
      throttle = THREE.MathUtils.clamp(throttle, -1, 1);

      if (Math.abs(throttle) > 0.1) {
        speedRef.current += throttle * acceleration * safeDelta;
      } else {
        speedRef.current = THREE.MathUtils.lerp(
          speedRef.current,
          0,
          2 * safeDelta,
        );
      }
      speedRef.current = THREE.MathUtils.clamp(speedRef.current, -8, maxSpeed);

      if (Math.abs(speedRef.current) > 0.1) {
        const turnSpeed = 1.2;
        const dir = speedRef.current > 0 ? 1 : -1;
        let steer = 0;
        if (left) steer += 1;
        if (right) steer -= 1;
        if (Math.abs(mobileInput.x) > 0.1) steer -= mobileInput.x;
        rotationVelocity.value += steer * turnSpeed * safeDelta * dir;
      }

      rotationVelocity.value = THREE.MathUtils.lerp(
        rotationVelocity.value,
        0,
        5 * safeDelta,
      );
      yaw.value += rotationVelocity.value * safeDelta;

      const direction = new THREE.Vector3(
        Math.sin(yaw.value),
        0,
        Math.cos(yaw.value),
      );
      direction.normalize().multiplyScalar(speedRef.current * safeDelta);

      // Update Next Pos (Manual)
      nextPos.add(direction);
    }

    // B. AUTO PILOT (Target Island ATAU Click Target)
    else if (targetIsland || clickTarget) {
      // Tentukan Tujuan & Jarak Berhenti
      let destination = new THREE.Vector3();
      let stopDistance = 1.5;

      if (targetIsland) {
        destination.set(
          targetIsland.dockPosition[0],
          targetIsland.dockPosition[1],
          targetIsland.dockPosition[2],
        );
        stopDistance = 1.5;
      } else if (clickTarget) {
        destination.copy(clickTarget);
        stopDistance = 2.0; // Jarak berhenti di laut bebas
      }

      const dist = currentPos.distanceTo(destination);

      if (isCinematic && dist < 30) setCinematic(false);

      // Jika belum sampai tujuan
      if (dist > stopDistance) {
        const dir = new THREE.Vector3()
          .subVectors(destination, currentPos)
          .normalize();
        const autoSpeed = isCinematic ? 10 : 15; // Speed Auto Pilot

        // Update Next Pos (Auto)
        const moveStep = dir.multiplyScalar(autoSpeed * safeDelta);
        nextPos.add(moveStep);

        // Smooth Rotation
        const targetAngle = Math.atan2(dir.x, dir.z);
        let angleDiff = targetAngle - yaw.value;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        yaw.value += angleDiff * 4 * safeDelta;
        speedRef.current = autoSpeed;
      } else {
        // SUDAH SAMPAI
        speedRef.current = 0;
        // Jika sampai di Click Target, hapus markernya
        if (clickTarget) {
          setClickTarget(null);
        }
      }
    }

    // Update Rotasi Visual (Berlaku utk Manual & Auto)
    group.current.rotation.y = yaw.value;

    // --- 3. UNIVERSAL COLLISION CHECK (Manual & Auto) ---
    let isColliding = false;

    for (const island of ISLANDS) {
      // Cek jarak nextPos ke PUSAT PULAU
      const islandPos = new THREE.Vector3(...island.position);
      const distToCenter = nextPos.distanceTo(islandPos);

      if (distToCenter < COLLISION_RADIUS) {
        isColliding = true;

        // Jika nabrak saat Auto Pilot
        if (targetIsland || clickTarget) {
          isAutoPilotCollision = true;
        }

        // Pantulkan / Stop
        speedRef.current = -speedRef.current * 0.5;
        break;
      }
    }

    // Terapkan Posisi jika Aman
    if (!isColliding) {
      currentPos.copy(nextPos);
    } else if (isAutoPilotCollision) {
      // Safety: Jika Auto Pilot nabrak tembok, matikan Auto Pilot
      setTargetIsland(null);
      setClickTarget(null);
      setIsManual(true); // Kembalikan ke manual
      speedRef.current = 0; // Stop
    }

    // --- 4. DOCKING SYSTEM (Trigger Popup) ---
    const isNowMoving = Math.abs(speedRef.current) > 0.1;
    setIsMoving(isNowMoving);

    if (!activeModal) {
      // Logic Reset (Hysteresis) - Jarak 40
      if (lastVisitedIsland.current) {
        const lastIslandData = ISLANDS.find(
          (i) => i.id === lastVisitedIsland.current,
        );
        if (lastIslandData) {
          const dist = currentPos.distanceTo(
            new THREE.Vector3(...lastIslandData.dockPosition),
          );
          if (dist > 70) {
            lastVisitedIsland.current = null;
          }
        }
      }

      // Logic Trigger - Jarak 25
      ISLANDS.forEach((island) => {
        if (island.id === lastVisitedIsland.current) return;

        const dockPos = new THREE.Vector3(...island.dockPosition);
        const distToDock = currentPos.distanceTo(dockPos);

        if (distToDock < DOCKING_TRIGGER_RADIUS) {
          speedRef.current = 0;
          setIsMoving(false);
          setIsManual(false);
          setTargetIsland(null);
          setClickTarget(null); // Reset click target juga
          if (isCinematic) setCinematic(false);

          lastVisitedIsland.current = island.id;
          openModal(island.id);
        }
      });
    }

    // --- 5. PHYSICS VISUALS ---
    const targetBank = isManual ? (left ? 0.4 : 0) + (right ? -0.4 : 0) : 0;
    bankAngle.current = THREE.MathUtils.lerp(
      bankAngle.current,
      targetBank,
      3 * safeDelta,
    );
    let yBob = Math.sin(t * 1.5) * 0.1;
    let xPitch = Math.cos(t * 0.8) * 0.02;
    const zRoll = Math.sin(t * 1) * 0.03 + bankAngle.current;

    if (isNowMoving) {
      yBob += 0.2;
      const pitchPower = Math.min(Math.abs(speedRef.current) / 10, 1);
      const dirPitch = speedRef.current > 0 ? -1 : 1;
      xPitch = 0.08 * pitchPower * dirPitch + Math.cos(t * 3) * 0.01;
    }

    visualRef.current.position.y = THREE.MathUtils.lerp(
      visualRef.current.position.y,
      yBob,
      4 * safeDelta,
    );
    visualRef.current.rotation.x = THREE.MathUtils.lerp(
      visualRef.current.rotation.x,
      xPitch,
      4 * safeDelta,
    );
    visualRef.current.rotation.z = THREE.MathUtils.lerp(
      visualRef.current.rotation.z,
      zRoll,
      4 * safeDelta,
    );
  });

  return (
    <TheatreObject id="SHIP">
      <group ref={group} position={[INITIAL_SHEEP, 0, 0]}>
        <group ref={visualRef}>
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Ship_Large as THREE.Mesh).geometry}
            material={materials.Atlas}
            scale={40}
            position={[0, -0.3, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />
          <pointLight
            position={[0, 4, 0]}
            intensity={2}
            color="orange"
            distance={10}
          />
          {isManual && (
            <Text
              position={[0, 8, 0]}
              fontSize={1.5}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.1}
              outlineColor="black"
            >
              CAPTAIN MODE
            </Text>
          )}
          <WaterTrail isMoving={isMoving} />
        </group>
      </group>
    </TheatreObject>
  );
};

useGLTF.preload('/3d/Ship.glb');
