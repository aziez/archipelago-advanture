/** biome-ignore-all lint/suspicious/noExplicitAny: <noExplicitAny> */
'use client';

import { ProjectCard } from '../shared/ProjectCard';
import { CharacterViewer } from '@/components/portfolio-overlay/shared/CharacterViewer';
import { PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

// --- 1. DATA CONFIG (Static Data: Images, Links, Tech Stack) ---
// Key 'id' harus match dengan key di file JSON messages
const projectsData = [
  {
    id: 'sportify',
    tags: ['Next.js', 'Typescript', 'Prisma', 'MySQL'],
    image: '/images/portfolio/sportify.png',
    href: 'https://sportify.or.id',
    featured: true,
  },
  {
    id: 'bifest',
    tags: ['Virtual Tour', 'Pano2VR', 'HTML5'],
    image: '/images/portfolio/bifest.png',
    href: 'https://dyc21.s3.ap-southeast-1.amazonaws.com/fesbukers_06/index.html',
    featured: true,
  },
  {
    id: 'product_list',
    tags: ['Next.js', 'Zustand', 'Tailwind'],
    image: '/images/portfolio/menu.png',
    href: 'https://list-product-fe.vercel.app',
  },
  {
    id: 'ip_tracker',
    tags: ['React', 'Leaflet', 'API'],
    image: '/images/portfolio/ip-chechker.png',
    href: 'https://main--ipmaptracker.netlify.app/',
  },
  {
    id: 'idec',
    tags: ['Wordpress', 'CMS'],
    image: '/images/portfolio/idec.png',
    href: 'https://indonesiadentalexpo.com/',
  },
  {
    id: 'best_event',
    tags: ['Wordpress', 'Event Mgmt'],
    image: '/images/portfolio/best.png',
    href: 'https://besteventsolution.id/',
  },
  {
    id: 'url_shortener',
    tags: ['Next.js', 'API Integration'],
    image: '/images/portfolio/url-shorter.png',
    href: 'https://main--regal-gecko-04a7cc.netlify.app/',
  },
  {
    id: 'advice_gen',
    tags: ['Javascript', 'API'],
    image: '/images/portfolio/advice.png',
    href: 'https://advicegenerator13.netlify.app/',
  },
];

// --- 2. 3D OBJECT (Abstract Art) ---
const ProjectArtifact = () => (
  <group>
    {/* Outer Wireframe */}
    <mesh rotation={[0.5, 0.5, 0]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#60a5fa" wireframe wireframeLinewidth={2} />
    </mesh>
    {/* Inner Core */}
    <mesh>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
    </mesh>
  </group>
);

export const ProjectGallery = () => {
  const t = useTranslations('Projects');

  return (
    <div className="p-8 md:p-12 space-y-12">
      {/* --- HEADER: 3D SHOWCASE --- */}
      <div className="relative bg-linear-to-r from-blue-900/20 to-slate-900/50 rounded-3xl border border-white/10 overflow-hidden p-8 md:p-10">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono tracking-widest uppercase">
              <PackageOpen size={14} />
              {t('header.tag')}
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {t('header.title_prefix')} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                  {t('header.title_highlight')}
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                {t('header.description')}
              </p>
            </div>
          </div>

          {/* Right: 3D Viewer */}
          <div className="h-75 w-full relative">
            <div className="absolute inset-0 border border-white/5 rounded-2xl bg-black/20 backdrop-blur-sm" />
            <CharacterViewer scale={1.8} offset={[0, 0, 0]}>
              <ProjectArtifact />
            </CharacterViewer>
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
              <span className="text-[10px] font-mono text-white/30 tracking-[0.3em]">
                {t('header.figure_label')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- PROJECT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <ProjectCard
            key={project.id}
            // Ambil text dari JSON berdasarkan ID. Type assertion diperlukan karena `t` tidak secara otomatis tahu semua kemungkinan `project.id`.
            title={t(`list.${project.id}.title` as any)}
            desc={t(`list.${project.id}.desc` as any)}
            // Data statis dari array local
            tags={project.tags}
            image={project.image}
            link={project.href}
            featured={project.featured}
          />
        ))}
      </div>
    </div>
  );
};
