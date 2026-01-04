/** biome-ignore-all lint/suspicious/noExplicitAny: <noExplicitAny> */
import { create } from 'zustand';
import * as THREE from 'three';

export type IslandType = 'about' | 'projects' | 'resume' | 'skills' | 'contact';

export interface IslandData {
  id: string;
  title: string;
  position: [number, number, number];
  icon?: any;
  dockPosition: [number, number, number];
  type: IslandType;
  themeColor: string;
}

interface GameState {
  time: number;
  isPaused: boolean;
  speed: number;
  theme: 'light' | 'dark';
  score: number;
  collectedIds: number[];

  // Navigation State
  targetIsland: IslandData | null;
  isManual: boolean;
  boatPositionRef: React.MutableRefObject<THREE.Vector3>;
  boatSpeedRef: React.MutableRefObject<number>;
  boatRotationRef: React.MutableRefObject<THREE.Quaternion>;
  clickTarget: THREE.Vector3 | null;

  mobileInput: {
    x: number; // -1 (Kiri) sampai 1 (Kanan)
    y: number; // -1 (Mundur) sampai 1 (Maju)
    isTurbo: boolean; // Tombol Turbo
  };

  // --- NEW: MODAL STATE ---
  activeModal: string | null;
  isCinematic: boolean;
  isMuted: boolean;

  // Actions
  setTime: (time: number) => void;
  openModal: (islandId: string) => void;
  closeModal: () => void;
  setTargetIsland: (island: IslandData | null) => void;
  setIsManual: (status: boolean) => void;
  addScore: (id: number) => void;
  tickTime: (delta: number) => void;
  togglePause: () => void;
  setSpeed: (speed: number) => void;
  setMobileInput: (x: number, y: number) => void;
  setMobileTurbo: (status: boolean) => void;
  setCinematic: (status: boolean) => void;
  toggleMute: () => void;
  setClickTarget: (point: THREE.Vector3 | null) => void;
}

const boatRef = { current: new THREE.Vector3(0, 0, 8) };
const speedRef = { current: 0 };
const rotationRef = { current: new THREE.Quaternion() };

export const useGameStore = create<GameState>((set, get) => ({
  time: 6,
  isPaused: true,
  speed: 1,
  theme: 'light',
  score: 0,
  collectedIds: [],
  targetIsland: null,
  isManual: false,
  boatPositionRef: boatRef,
  boatSpeedRef: speedRef,
  boatRotationRef: rotationRef,
  clickTarget: null,

  mobileInput: { x: 0, y: 0, isTurbo: false },

  isMuted: false, // Default nyala
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  // Initial State Modal
  activeModal: null,
  isCinematic: true,

  // --- ACTIONS ---
  openModal: (islandId) => set({ activeModal: islandId, isPaused: true }), // Pause game saat baca
  closeModal: () => set({ activeModal: null, isPaused: false }), // Resume saat tutup
  setCinematic: (status) => set({ isCinematic: status }),

  setTime: (time) => {
    const theme = time >= 5 && time < 19 ? 'light' : 'dark';
    set({ time, theme });
  },
  tickTime: (delta) => {
    const { isPaused, speed, time } = get();
    if (isPaused) return;

    // RUMUS WAKTU BARU:
    // Lama (0.4)  -> 1 Hari = 1 Menit (Terlalu Cepat)
    // Baru (0.05) -> 1 Hari = 8 Menit (Slow & Relaxing)
    // Jika mau lebih lambat lagi, ubah jadi 0.02

    const hourIncrement = delta * 0.02 * speed;

    let newHour = time + hourIncrement;
    if (newHour >= 24) newHour = 0;

    // Update theme tetap sama
    const newTheme = newHour >= 5 && newHour < 19 ? 'light' : 'dark';
    set({ time: newHour, theme: newTheme });
  },
  setPaused: (isPaused: boolean) => set({ isPaused }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setSpeed: (speed) => set({ speed }),
  setTargetIsland: (island) =>
    set({ targetIsland: island, clickTarget: null, isManual: false }),
  setIsManual: (isManual) => {
    if (isManual)
      set({
        isManual,
        targetIsland: null,
        clickTarget: null,
      });
    else set({ isManual });
  },
  setMobileInput: (x, y) =>
    set((state) => ({
      mobileInput: { ...state.mobileInput, x, y },
    })),
  setMobileTurbo: (isTurbo) =>
    set((state) => ({
      mobileInput: { ...state.mobileInput, isTurbo },
    })),
  setClickTarget: (point) =>
    set({ clickTarget: point, isManual: false, targetIsland: null }),

  addScore: (id) =>
    set((state) => ({
      score: state.score + 100,
      collectedIds: [...state.collectedIds, id],
    })),
}));
