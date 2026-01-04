import type { IslandData } from '@/stores/useGameStore';
import {
  IconHome,
  IconBriefcase,
  IconWand,
  IconMail,
  IconBookFilled,
} from '@tabler/icons-react';

// FORMATION: DIAMOND EXPANDED
// Skala Baru:
// - Collision Radius (Merah): 35 unit
// - Docking Trigger (Hijau): 45 unit
// - Jarak Aman Dock dari Pusat Pulau: ~50 unit

export const ISLANDS: IslandData[] = [
  {
    id: 'home',
    title: 'Home Base',
    type: 'about',
    icon: IconHome,
    themeColor: '#fbbf24',

    // SELATAN
    position: [-100, 0, 150],
    dockPosition: [-100, 0, 150],
  },
  {
    id: 'projects',
    title: 'Treasure Cove',
    type: 'projects',
    icon: IconBriefcase,
    themeColor: '#8b5cf6',

    // BARAT
    position: [-180, 0, 0],
    dockPosition: [-180, 0, 0],
  },
  {
    id: 'skills',
    title: 'Wizard Tower',
    type: 'skills',
    icon: IconWand,
    themeColor: '#3b82f6',

    // TIMUR
    // Geser ke 180
    position: [180, 0, 0],
    dockPosition: [180, 0, 0],
  },
  {
    id: 'contact',
    title: 'Post Office',
    type: 'contact',
    icon: IconMail,
    themeColor: '#ec4899',

    // UTARA
    position: [25, 0, -150],
    dockPosition: [25, 0, -150],
  },
  {
    id: 'resume',
    title: 'Resume Library',
    type: 'resume',
    icon: IconBookFilled,
    themeColor: '#10b981',

    // TENGGARA (Pojok)
    position: [120, 0, 180],
    dockPosition: [120, 0, 180],
  },
];
