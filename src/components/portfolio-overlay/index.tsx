'use client';

import { useGameStore } from '@/stores/useGameStore';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// SHADCN UI COMPONENTS
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';

// Import Sections
import { HomeProfile } from './sections/HomeProfile';
import { ProjectGallery } from './sections/ProjectGallery';
import { SkillsArsenal } from './sections/SkillsArsenal';
import { ResumeTimeline } from './sections/ResumeTimeline';
import { ContactTerminal } from './sections/ContactTerminal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const PortfolioOverlay = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const closeModal = useGameStore((state) => state.closeModal);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Helper: Render Content
  const renderContent = () => {
    switch (activeModal) {
      case 'home':
        return <HomeProfile />;
      case 'projects':
        return <ProjectGallery />;
      case 'skills':
        return <SkillsArsenal />;
      case 'resume':
        return <ResumeTimeline />;
      case 'contact':
        return <ContactTerminal />;
      default:
        return null;
    }
  };

  const getModalConfig = () => {
    switch (activeModal) {
      case 'home':
        return {
          title: 'IDENTITY_MODULE // CAPTAIN',
          color: 'bg-yellow-500',
          border: 'border-yellow-500/30',
        };
      case 'projects':
        return {
          title: 'ARCHIVE_MODULE // DISCOVERIES',
          color: 'bg-purple-500',
          border: 'border-purple-500/30',
        };
      case 'skills':
        return {
          title: 'SYSTEM_MODULE // CAPABILITIES',
          color: 'bg-blue-500',
          border: 'border-blue-500/30',
        };
      case 'resume':
        return {
          title: 'LOG_MODULE // TIMELINE',
          color: 'bg-emerald-500',
          border: 'border-emerald-500/30',
        };
      case 'contact':
        return {
          title: 'COMM_MODULE // UPLINK',
          color: 'bg-pink-500',
          border: 'border-pink-500/30',
        };
      default:
        return {
          title: 'SYSTEM // UNKNOWN',
          color: 'bg-slate-500',
          border: 'border-slate-500/30',
        };
    }
  };

  const config = getModalConfig();
  const isOpen = !!activeModal;

  const ModalHeaderContent = () => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="relative flex h-2.5 w-2.5">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              config.color,
            )}
          ></span>
          <span
            className={cn(
              'relative inline-flex rounded-full h-2.5 w-2.5',
              config.color,
            )}
          ></span>
        </div>
        <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70">
          {config.title}
        </span>
      </div>
    </div>
  );

  // --- DESKTOP VIEW (DIALOG) ---
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent
          className={cn(
            // PERBAIKAN 1: Tambahkan 'flex flex-col' agar children bisa expand
            'sm:max-w-5xl h-[85vh] p-0 gap-0 flex flex-col',
            'bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 text-slate-100',
            'shadow-2xl overflow-hidden rounded-2xl',
            config.border,
          )}
        >
          {/* Header (Fixed Height) */}
          <DialogHeader className="px-6 py-4 border-b border-white/5 bg-white/2 shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <ModalHeaderContent />
            </DialogTitle>
          </DialogHeader>

          {/* PERBAIKAN 2: ScrollArea pakai 'flex-1' agar mengisi sisa ruang & 'overflow-hidden' */}
          <div className="flex-1 overflow-hidden relative w-full">
            <ScrollArea className="h-full w-full">
              <div className="p-0 pb-10">{renderContent()}</div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // --- MOBILE VIEW (DRAWER) ---
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DrawerContent
        className={cn(
          'h-[92vh] flex flex-col mt-24 rounded-t-[2rem]',
          'bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 text-slate-100',
          config.border,
        )}
      >
        <DrawerHeader className="px-6 py-2 border-b border-white/5 bg-white/2 shrink-0 text-left">
          <DrawerTitle>
            <ModalHeaderContent />
          </DrawerTitle>
        </DrawerHeader>

        {/* PERBAIKAN 4: Bungkus ScrollArea dengan div flex-1 overflow-hidden */}
        {/* Ini memaksa ScrollArea menghitung tinggi berdasarkan sisa ruang Drawer */}
        <div className="flex-1 w-full overflow-hidden bg-transparent">
          <ScrollArea className="h-full w-full">
            {/* Tambahkan padding bawah yang cukup agar konten terbawah tidak tertutup bottom bar HP */}
            <div className="px-0 pb-20 pt-4">{renderContent()}</div>
          </ScrollArea>
        </div>

        {/* Close Button Mobile */}
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full z-50"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};
