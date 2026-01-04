/** biome-ignore-all lint/a11y/useValidAnchor: <explanation> */
'use client';

import { useGameStore } from '@/stores/useGameStore';
import { GlassCard } from './GlassCard';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Github,
  Linkedin,
  ExternalLink,
  User,
  Code,
  FileText,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// DATA DUMMY KONTEN (Nanti bisa dipisah ke file data)
const CONTENT_DATA: Record<string, any> = {
  home: {
    title: "Captain's Log (About Me)",
    icon: <User size={24} />,
    content: (
      <div className="space-y-4 text-white/80">
        <p>
          Ahoy! I am a Creative Developer passionate about building immersive 3D
          web experiences. Currently sailing the seas of React, Three.js, and
          TypeScript.
        </p>
        <p>
          My mission is to bridge the gap between static websites and
          interactive worlds.
        </p>
      </div>
    ),
  },
  projects: {
    title: 'Treasure Chest (Projects)',
    icon: <Code size={24} />,
    content: (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-black/20 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
          >
            <h3 className="text-white font-bold text-lg mb-1">Project {i}</h3>
            <p className="text-sm text-white/60 mb-3">
              A fantastic 3D voyage built with Next.js.
            </p>
            <div className="flex gap-2">
              <Button className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded hover:bg-blue-500/40 transition">
                Demo
              </Button>
              <Button className="text-xs bg-white/10 text-white px-2 py-1 rounded hover:bg-white/20 transition">
                Code
              </Button>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  skills: {
    title: 'Arsenal (Skills)',
    icon: <Code size={24} />,
    content: (
      <div className="flex flex-wrap gap-2">
        {[
          'React',
          'Three.js',
          'TypeScript',
          'Next.js',
          'Tailwind',
          'Blender',
          'Node.js',
        ].map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-white/10 rounded-full text-sm text-white border border-white/10"
          >
            {skill}
          </span>
        ))}
      </div>
    ),
  },
  contact: {
    title: 'Send Owl (Contact)',
    icon: <Mail size={24} />,
    content: (
      <div className="space-y-4">
        <p className="text-white/80">
          Ready to embark on a new adventure? Let's connect!
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="p-3 bg-blue-600/20 rounded-lg text-blue-200 hover:bg-blue-600/40 transition"
          >
            <Linkedin />
          </a>
          <a
            href="#"
            className="p-3 bg-gray-800/50 rounded-lg text-white hover:bg-gray-700/50 transition"
          >
            <Github />
          </a>
          <a
            href="#"
            className="p-3 bg-green-600/20 rounded-lg text-green-200 hover:bg-green-600/40 transition"
          >
            <Mail />
          </a>
        </div>
      </div>
    ),
  },
};

export const PortfolioOverlay = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const closeModal = useGameStore((state) => state.closeModal);

  const data = activeModal ? CONTENT_DATA[activeModal] : null;

  return (
    <AnimatePresence>
      {activeModal && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Gelap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl pointer-events-auto"
          >
            <GlassCard className="p-0 overflow-hidden border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
                    {data.icon}
                  </div>
                  <h2 className="text-2xl font-bold tracking-wide">
                    {data.title}
                  </h2>
                </div>
                <Button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </Button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {data.content}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
