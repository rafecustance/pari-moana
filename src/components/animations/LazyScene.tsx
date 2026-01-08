'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

/**
 * Example lazy-loaded Three.js scene wrapper.
 *
 * Usage:
 * 1. Create your actual Three.js scene in ./Scene.tsx
 * 2. Import and use <LazyScene /> in your components
 *
 * The Scene component will only be loaded on the client side,
 * preventing SSR issues with Three.js.
 */

const Scene = dynamic(() => import('./Scene'), {
  ssr: false, // Three.js uses window/document APIs
  loading: () => (
    <div className="flex h-[400px] items-center justify-center bg-neutral-900 animate-pulse">
      <span className="text-neutral-500">Loading 3D scene...</span>
    </div>
  ),
});

interface LazySceneProps {
  className?: string;
}

export function LazyScene({ className }: LazySceneProps) {
  return (
    <Suspense fallback={null}>
      <div className={className}>
        <Scene />
      </div>
    </Suspense>
  );
}

