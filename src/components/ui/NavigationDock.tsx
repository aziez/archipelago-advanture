/** biome-ignore-all lint/suspicious/noExplicitAny: <noExplicitAny> */
'use client';

import { useGameStore } from '@/stores/useGameStore';
import { FloatingDock } from './floating-dock';
import { ISLANDS } from '@/constants/island';
import { useTranslations } from 'next-intl';

export const NavigationDock = () => {
  // 2. Panggil namespace 'Islands' (sesuai JSON yang kita buat tadi)
  const t = useTranslations('Islands');

  const setTargetIsland = useGameStore((state) => state.setTargetIsland);

  // Kita map data ISLANDS menjadi format yang diterima FloatingDock
  const dockItems = ISLANDS.map((island) => {
    const IconIsland = island.icon;

    return {
      // 3. UBAH DI SINI:
      // Dari: title: island.title
      // Ke:   title: t(island.id)
      // (Artinya: ambil teks berdasarkan ID: 'home', 'projects', 'skills', dll). Type assertion diperlukan karena `t` tidak secara otomatis tahu semua kemungkinan `island.id`.
      title: t(island.id as any),

      icon: <IconIsland className="w-full h-full text-white" />,
      onClick: () => setTargetIsland(island),
    };
  });

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full flex justify-center">
      {/* Wrapper pointer-events-auto agar tombol bisa diklik */}
      {/* Saya tambahkan flex-col & gap agar Switcher ada di bawah Dock dengan rapi */}
      <div className="pointer-events-auto flex flex-col items-center gap-4">
        <FloatingDock items={dockItems} />
      </div>
    </div>
  );
};
