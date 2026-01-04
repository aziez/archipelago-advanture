/** biome-ignore-all lint/suspicious/noExplicitAny: <noExplicitAny> */
'use client';

import { Code2, Server, Cpu, Zap } from 'lucide-react';
import { CharacterViewer } from '@/components/portfolio-overlay/shared/CharacterViewer';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { useTranslations } from 'next-intl'; // 1. Import Hook

// --- 1. 3D OBJECT (TechCore) - Tidak Berubah ---
const TechCore = () => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.2;
      outerRef.current.rotation.y += delta * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.5;
      innerRef.current.rotation.z += delta * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      innerRef.current.scale.setScalar(scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x =
        Math.PI / 2 + Math.sin(state.clock.elapsedTime) * 0.2;
      ringRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#10b981"
          wireframe
          wireframeLinewidth={2}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#10b981"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.8, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#6ee7b7"
          emissive="#34d399"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
};

// --- 2. SUB-COMPONENT: SKILL CARD ---
const SkillCategory = ({
  title,
  icon,
  skills,
  accentColor = 'bg-blue-500',
}: {
  title: string;
  icon: any;
  skills: { name: string; level: number }[];
  accentColor?: string;
}) => (
  <div className="group relative bg-[#0f172a]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
    <div
      className={`absolute -top-10 -right-10 w-32 h-32 ${accentColor} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity duration-500`}
    />

    <div className="p-6 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-white group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            {title}
          </h3>
        </div>
        <div className="flex gap-1">
          <div
            className={`w-1.5 h-1.5 rounded-full ${accentColor} animate-pulse`}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="space-y-5">
        {skills.map((skill, i) => (
          <div key={i as number}>
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-slate-300">{skill.name}</span>
              <span className="text-slate-500">{skill.level}%</span>
            </div>
            <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${accentColor} shadow-[0_0_10px_currentColor]`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- 3. MAIN COMPONENT ---
export const SkillsArsenal = () => {
  const t = useTranslations('Skills'); // 2. Panggil Namespace

  return (
    <div className="p-6 md:p-12 space-y-10">
      {/* HEADER SECTION: 3D DASHBOARD */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="grid md:grid-cols-12 gap-0 items-center">
          {/* Text Area */}
          <div className="md:col-span-7 p-8 md:p-10 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase">
              <Zap size={14} />
              {t('header.tag')}
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              {t('header.title_prefix')} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
                {t('header.title_highlight')}
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              {t('header.description')}
            </p>
          </div>

          {/* 3D Viewer Area */}
          <div className="md:col-span-5 h-75 md:h-87.5 relative bg-linear-to-b from-slate-800/50 to-transparent">
            <CharacterViewer scale={1.8} offset={[0, 0, 0]}>
              <TechCore />
            </CharacterViewer>

            {/* Overlay UI */}
            <div className="absolute bottom-4 right-6 text-right pointer-events-none">
              <div className="text-emerald-500 font-mono text-xs font-bold">
                {t('header.status')}
              </div>
              <div className="text-white/20 text-[10px] tracking-widest">
                {t('header.metrics')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SKILLS GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 1. CREATIVE & FRONTEND: Web + 3D Modeling Assets */}
        <SkillCategory
          title={t('categories.frontend.title')} // "Inti Frontend" / "Frontend Core"
          icon={<Code2 />}
          accentColor="bg-blue-500"
          skills={[
            { name: 'React / Next.js / Remix', level: 98 },
            { name: 'Three.js / R3F / WebGL', level: 90 },
            { name: 'Blender / 3ds Max (3D)', level: 85 }, // Aset visual custom
            { name: 'Tailwind / Shadcn UI', level: 95 },
            { name: 'TypeScript / ES6+', level: 92 },
          ]}
        />

        {/* 2. ENGINEERING & MOBILE: Native, Hardware & Systems */}
        <SkillCategory
          title="Engineering & Mobile" // Bisa ditranslate atau hardcode "Engineering"
          icon={<Cpu />} // Icon CPU cocok untuk low-level/hardware
          accentColor="bg-amber-500"
          skills={[
            { name: 'Android Native (Java)', level: 85 }, // Skill Mobile Native
            { name: 'Ionic / Capacitor', level: 90 }, // Skill Mobile Hybrid
            { name: 'Arduino / C++ / IoT', level: 80 }, // Hardware interaction
            { name: 'C# / .NET Ecosystem', level: 85 }, // Strong typing logic
          ]}
        />

        {/* 3. BACKEND & INFRA: Server & Cloud */}
        <SkillCategory
          title={t('categories.backend.title')} // "Operasi Backend"
          icon={<Server />}
          accentColor="bg-purple-500"
          skills={[
            { name: 'Laravel / TALL Stack', level: 90 },
            { name: 'Node.js / NestJS', level: 85 },
            { name: 'PostgreSQL / MySQL', level: 88 },
            { name: 'AWS / Docker / Ubuntu', level: 80 },
            { name: 'Git / CI/CD Pipelines', level: 90 },
          ]}
        />
        <SkillCategory
          title={t('categories.tools.title')}
          icon={<Cpu />}
          accentColor="bg-emerald-500"
          skills={[
            { name: 'Git / GitHub', level: 90 },
            { name: 'Docker', level: 70 },
            { name: 'Figma', level: 75 },
            { name: 'Vercel / AWS', level: 80 },
          ]}
        />
      </div>
    </div>
  );
};
