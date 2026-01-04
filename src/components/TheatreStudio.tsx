'use client';

import { useEffect } from 'react';

// Toggle ini untuk mematikan/menyalakan panel studio
const ENABLE_STUDIO = false; // Set FALSE jika ingin build production atau hide panel

export const TheatreStudio = () => {
  useEffect(() => {
    if (ENABLE_STUDIO && process.env.NODE_ENV === 'development') {
      import('@theatre/studio').then((studio) => {
        studio.default.initialize();
        // studio.default.ui.restore();
      });
    }
  }, []);

  return null;
};
