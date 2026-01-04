'use client';

import { Sky, Stars, Environment } from '@react-three/drei';
import { useGameStore } from '@/stores/useGameStore';
import { Sun } from './Sun';
import { AtmosphericEffects } from '@/components/AtmosphericEffects';

export const SkyBox = () => {
  // 1. SELECTOR HEMAT PERFORMA
  // Kita ambil time langsung dari store state di dalam useFrame (bukan via hook yang trigger re-render berat)
  // Atau kita ambil via hook tapi pastikan komponen ini ringan.
  const time = useGameStore((state) => state.time);

  // Hitung Posisi Matahari berdasarkan Waktu (0 - 24)
  // Rumus: Matahari berputar di sumbu X
  // Jam 6 pagi = Terbit (X positif), Jam 18 = Terbenam (X negatif)
  const sunPosition = calculateSunPosition(time);

  // Logic Siang/Malam untuk visual
  // Stars akan selalu ada, tapi saat siang (matahari tinggi), Sky akan menutupinya.
  // Saat malam (matahari di bawah), Sky jadi hitam, Stars terlihat.

  return (
    <>
      {/* --- 1. LANGIT (SELALU RENDER) --- */}
      {/* Sky dari Drei otomatis mengatur warna atmosfer berdasarkan posisi matahari */}
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        inclination={0}
        azimuth={0.25}
        // Tweak parameter ini agar transisi sore ke malam mulus
        turbidity={10}
        rayleigh={0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* --- 2. BINTANG (SELALU RENDER) --- */}
      {/* Stars kita taruh di belakang. Saat siang, brightness Sky menutupinya. */}
      <Stars
        radius={200}
        depth={50}
        count={1500} // Turunkan drastis dari 5000 ke 1000-1500 (Gak bakal sadar bedanya)
        factor={6} // Perbesar sedikit ukuran bintangnya biar tetep kelihatan
        saturation={0}
        fade
        speed={0.5}
      />

      {/* --- 3. MATAHARI FISIK (GLOWING SPHERE) --- */}
      <Sun time={time} position={sunPosition} />

      {/* --- 4. EFEK ATMOSFER --- */}
      {/* Render hanya jika perlu, atau optimize di dalamnya */}
      <AtmosphericEffects />

      {/* --- 5. LIGHTING & ENV --- */}
      {/* PENTING: Jangan ganti preset 'sunset' <-> 'night' secara dinamis! Itu bikin LAG. */}
      {/* Pakai satu preset netral, atau 'night' yang diterangi Sun Light */}
      <Environment preset="night" blur={0.6} background={false} />

      {/* Tambahkan Ambient Light dinamis agar malam tidak gelap gulita */}
      <ambientLight intensity={time > 6 && time < 18 ? 0.8 : 0.2} />
    </>
  );
};

// --- HELPER FUNCTION ---
function calculateSunPosition(time: number): [number, number, number] {
  // Mapping waktu 0-24 ke sudut radian
  // Jam 12 siang = Matahari di atas (90 derajat / PI/2)
  // Jam 6 pagi = Terbit
  // Jam 18 sore = Terbenam

  // 1. Normalisasi waktu ke range 0-1 (tapi digeser biar jam 12 itu puncak)
  // (time / 24) * 2 * PI

  // Cara simpel:
  // Gunakan Sinus Cosinus untuk rotasi melingkar
  const radius = 1000;
  const theta = (time / 24) * Math.PI * 2; // 0 sampai 2PI

  // Offset -Math.PI/2 agar jam 6 pagi pas di horizon
  const offset = -Math.PI / 2;

  const x = Math.cos(theta + offset) * radius;
  const y = Math.sin(theta + offset) * radius;
  const z = -200; // Agak miring ke selatan biar ada bayangan menarik

  return [x, y, z];
}
