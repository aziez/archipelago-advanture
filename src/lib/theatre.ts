// src/lib/theatre.ts
import { getProject, types } from '@theatre/core';
import theatreState from '@/assets/theatre-state-2.json';
import levelState from '@/assets/level-state-2.json';

// --- 1. PROJECT: CINEMATIC (Intro) ---
export const cinematicProject = getProject('PortfolioProject', {
  state: theatreState,
});
export const introSheet = cinematicProject.sheet('Intro Sequence');

export const cameraObj = introSheet.object('Camera Director', {
  // POSISI KAMERA (Relative to Boat)
  offset: types.compound({
    x: types.number(-100, { range: [-2000, 2000], nudgeMultiplier: 10 }), // Range diperbesar 10x
    y: types.number(150, { range: [-500, 2000], nudgeMultiplier: 10 }), // Bisa terbang tinggi banget
    z: types.number(150, { range: [-2000, 2000], nudgeMultiplier: 10 }),
  }),

  // TITIK FOKUS KAMERA (Look At)
  lookAtOffset: types.compound({
    x: types.number(0, { range: [-1000, 1000], nudgeMultiplier: 5 }),
    y: types.number(0, { range: [-500, 500], nudgeMultiplier: 5 }),
    z: types.number(0, { range: [-1000, 1000], nudgeMultiplier: 5 }),
  }),

  // ✨ EFEK DRAMATIS (ZOOM)
  // FOV 30 = Telephoto (Cinematic/Movie like)
  // FOV 90 = Wide Angle (Action/Fast)
  fov: types.number(75, { range: [10, 120], nudgeMultiplier: 1 }),

  // ✨ EFEK ROTASI (DUTCH ANGLE)
  // Miringin kamera dikit biar aksi terasa cepat
  roll: types.number(0, { range: [-180, 180] }),
});

// --- 2. PROJECT: LEVEL DESIGN ---
export const levelProject = getProject('LevelDesign', {
  state: levelState,
});

export const levelSheet = levelProject.sheet('Main Map');
