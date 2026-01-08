'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion.
 *
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * if (prefersReducedMotion) {
 *   // Skip or simplify animation
 * }
 * ```
 *
 * Note: Returns false during SSR, then updates on client.
 * For CSS-only solutions, use the media query in globals.css.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Utility to conditionally apply animation props.
 *
 * Usage with framer-motion:
 * ```tsx
 * <motion.div {...motionSafe({ initial: { opacity: 0 }, animate: { opacity: 1 } })} />
 * ```
 */
export function motionSafe<T extends object>(
  animationProps: T,
  prefersReducedMotion: boolean
): T | Record<string, never> {
  return prefersReducedMotion ? {} : animationProps;
}

