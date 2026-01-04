'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-full h-screen bg-linear-to-b from-blue-400 to-blue-600 overflow-hidden">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  );
}
