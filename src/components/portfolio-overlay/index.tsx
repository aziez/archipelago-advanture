'use client';

import { useGameStore } from '@/stores/useGameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

// Import Sections
import { HomeProfile } from './sections/HomeProfile';
import { ProjectGallery } from './sections/ProjectGallery';
import { SkillsArsenal } from './sections/SkillsArsenal';
import { ResumeTimeline } from './sections/ResumeTimeline';
import { ContactTerminal } from './sections/ContactTerminal';
import { Button } from '@/components/ui/button';

export const PortfolioOverlay = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const closeModal = useGameStore((state) => state.closeModal);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#0f172a]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header / Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activeModal === 'contact' ? 'bg-pink-500' : 'bg-blue-500'
                  } animate-pulse`}
                />
                <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                  {activeModal === 'home' && 'IDENTITY_MODULE // CAPTAIN'}
                  {activeModal === 'projects' &&
                    'ARCHIVE_MODULE // DISCOVERIES'}
                  {activeModal === 'skills' && 'SYSTEM_MODULE // CAPABILITIES'}
                  {activeModal === 'resume' && 'LOG_MODULE // TIMELINE'}
                  {activeModal === 'contact' && 'COMM_MODULE // UPLINK'}
                </span>
              </div>
              <Button
                onClick={closeModal}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeModal === 'home' && <HomeProfile />}
              {activeModal === 'projects' && <ProjectGallery />}
              {activeModal === 'skills' && <SkillsArsenal />}
              {activeModal === 'resume' && <ResumeTimeline />}
              {activeModal === 'contact' && <ContactTerminal />}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
