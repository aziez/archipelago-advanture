/** biome-ignore-all lint/suspicious/noExplicitAny: <noExplicitAny> */
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { Briefcase, Calendar, Download, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CharacterViewer } from '@/components/portfolio-overlay/shared/CharacterViewer';
import { useTranslations } from 'next-intl';
const ChronosNode = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
      coreRef.current.rotation.z += delta * 0.1;
      const scale = 1 + Math.sin(t) * 0.1;
      coreRef.current.scale.setScalar(scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.5;
      ringRef.current.rotation.y = t * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.3;
      ring2Ref.current.rotation.y = -t * 0.5;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <cylinderGeometry args={[0, 0.8, 1.5, 6]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={1.5}
          wireframe={false}
          flatShading
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#fbbf24"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.6, 0.02, 16, 100]} />
        <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.0, 0.02, 16, 100]} />
        <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" />
      </mesh>
    </group>
  );
};

// --- 2. SUB-COMPONENT: LOG ENTRY ---
const LogEntry = ({
  role,
  company,
  year,
  desc,
  isLatest = false,
}: {
  role: string;
  company: string;
  year: string;
  desc: string;
  isLatest?: boolean;
}) => (
  <div className="relative pl-8 pb-12 last:pb-0 group">
    <div className="absolute left-2.75 top-0 bottom-0 w-px bg-white/10 group-last:bg-transparent" />
    <div
      className={`absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-[#0f172a] transition-all duration-300 ${
        isLatest
          ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-110'
          : 'bg-slate-700 group-hover:bg-amber-500/50'
      }`}
    />
    <div
      className={`relative p-6 rounded-xl border transition-all duration-300 ${
        isLatest
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3
            className={`text-lg font-bold ${
              isLatest ? 'text-amber-400' : 'text-white'
            }`}
          >
            {role}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Briefcase size={14} className="text-amber-500/50" />
            {company}
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/10 text-xs font-mono text-slate-400 whitespace-nowrap">
          <Calendar size={12} />
          {year}
        </div>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      {isLatest && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-20 border-r-20 border-t-amber-500/20 border-r-transparent rounded-bl" />
      )}
    </div>
  </div>
);

const timelineIds = ['udana', 'sfund', 'freelance', 'lokcay', 'piranasia'];
// --- 3. MAIN COMPONENT ---
export const ResumeTimeline = () => {
  const t = useTranslations('Resume'); // 2. Panggil Namespace

  const handleDownload = () => {
    window.open(
      'https://1drv.ms/b/s!Am7mTXvg_uCXhOFbGUd3L1NNwZ9uYA?embed=1&em=2',
      '_blank',
    );
  };

  return (
    <div className="p-4 md:p-10 h-full flex flex-col md:flex-row gap-8">
      {/* --- LEFT COLUMN: INFO & 3D --- */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        {/* 3D Visualizer */}
        <div className="relative h-72 rounded-2xl bg-linear-to-b from-slate-800 to-slate-900 border border-amber-500/20 overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <div className="text-[10px] text-amber-500 font-mono tracking-widest uppercase mb-1">
              {t('header.status_label')}
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-white font-bold text-sm">
                {t('header.status_text')}
              </span>
            </div>
          </div>

          <CharacterViewer scale={1.8} offset={[0, 0, 0]}>
            <ChronosNode />
          </CharacterViewer>

          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-slate-900 to-transparent pointer-events-none" />
        </div>

        {/* Summary Card (Education) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-white font-bold mb-1">
              {t('header.education_title')}
            </h3>
            <div className="flex gap-3 mt-3">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg h-fit">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">
                  {t('education.degree')}
                </div>
                <div className="text-slate-400 text-xs">
                  {t('education.school')}
                </div>
                <div className="text-slate-500 text-[10px] mt-1">
                  {t('education.years')}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <Button
            onClick={handleDownload}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-12 rounded-lg shadow-lg shadow-amber-900/20 group"
          >
            <Download
              size={18}
              className="mr-2 group-hover:-translate-y-1 transition-transform"
            />
            {t('header.download_btn')}
          </Button>
        </div>
      </div>

      {/* --- RIGHT COLUMN: TIMELINE --- */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-2">
            {t('header.title')}
          </h2>
          <p className="text-slate-400 text-sm font-mono">
            {t('header.subtitle')}
          </p>
        </div>

        <div className="space-y-2">
          {timelineIds.map((id, index) => (
            <LogEntry
              key={id} // Penting untuk React list
              role={t(`timeline.${id}.role` as any)}
              company={t(`timeline.${id}.company` as any)}
              year={t(`timeline.${id}.year` as any)}
              desc={t(`timeline.${id}.desc` as any)}
              isLatest={index === 0}
            />
          ))}
        </div>

        {/* End of Log Marker */}
        <div className="pl-8 pt-4 flex items-center gap-2 opacity-50">
          <div className="w-2 h-2 rounded-full bg-slate-600" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            End of Log
          </span>
        </div>
      </div>
    </div>
  );
};
