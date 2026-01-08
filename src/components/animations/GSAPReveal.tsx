'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * GSAP-powered reveal animation.
 *
 * Use this for:
 * - Complex multi-element sequences
 * - ScrollTrigger-based animations
 * - When you need GSAP's timeline precision
 *
 * For simple fade/slide animations, prefer FadeIn (framer-motion).
 */

interface GSAPRevealProps {
  children: ReactNode;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  className?: string;
}

export function GSAPReveal({
  children,
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
  className,
}: GSAPRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        // Skip animation, just show content
        gsap.set(containerRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(containerRef.current, from, to);
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={containerRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

