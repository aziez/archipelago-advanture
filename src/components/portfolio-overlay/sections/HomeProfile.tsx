'use client';
import { Terminal, MapPin, Calendar, Github, Linkedin } from 'lucide-react';
import { StatBar } from '../shared/StatBar';
import { SocialBtn } from '../shared/SocialBtn';
import { CharacterViewer } from '@/components/portfolio-overlay/shared/CharacterViewer';
import { CaptainCharacter } from '@/components/scene/part/CaptainCharacter';
import { useTranslations } from 'next-intl';

export const HomeProfile = () => {
  const t = useTranslations('Home');

  return (
    <div className="grid md:grid-cols-12 gap-0 min-h-full pointer-events-none">
      {/* Left: Visual Avatar (Hero) */}
      <div className="md:col-span-5 bg-linear-to-br from-blue-900/40 to-slate-900 relative min-h-75 md:min-h-auto p-8 flex flex-col justify-end border-r border-white/10">
        <div
          className="absolute inset-0 bg-slate-800 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1544502062-f82887f03d1c?q=80&w=1000&auto=format&fit=crop)',
          }}
        />

        <CharacterViewer scale={1.2} offset={[0, -1, 0]}>
          <CaptainCharacter />
        </CharacterViewer>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
            M. Abdul <span className="text-blue-400">Aziz</span>
          </h1>
          <p className="text-blue-200 font-mono text-sm tracking-wide mb-6">
            {t('role')}
          </p>

          {/* RPG Stats */}
          <div className="space-y-3 bg-black/40 p-4 rounded-xl backdrop-blur-sm border border-white/10">
            <StatBar label="Creativity" value={90} color="bg-purple-500" />
            <StatBar label="Logic" value={85} color="bg-blue-500" />
            <StatBar label="Caffeine" value={100} color="bg-amber-500" />
          </div>
        </div>
      </div>

      {/* Right: Bio & Story */}
      <div className="md:col-span-7 p-8 md:p-12 space-y-8 bg-[#0f172a]">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Terminal size={24} className="text-blue-400" />
            {t('title')}
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            {t.rich('mission_desc', {
              blue: (chunks) => (
                <span className="text-blue-400 font-bold">{chunks}</span>
              ),
            })}
          </p>
          <p className="text-slate-400 leading-relaxed">{t('mission_sub')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm">
              <MapPin size={16} /> {t('location')}
            </div>
            <div className="text-white font-semibold">Jakarta, ID</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm">
              <Calendar size={16} /> {t('exp')}
            </div>
            <div className="text-white font-semibold">{t('years')}</div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <SocialBtn icon={<Github size={18} />} label="GitHub" />
          <SocialBtn icon={<Linkedin size={18} />} label="LinkedIn" />
        </div>
      </div>
    </div>
  );
};
