'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ImageBlockProps {
  label?: string;
  aspectRatio?: 'wide' | 'cinematic' | 'standard';
  className?: string;
}

const aspectRatios = {
  wide: 'aspect-[21/9]',
  cinematic: 'aspect-[16/9]',
  standard: 'aspect-[4/3]',
};

/**
 * Full-bleed image placeholder block with scroll-triggered reveal.
 * Designed for edge-to-edge imagery with no containers.
 */
export function ImageBlock({
  label,
  aspectRatio = 'cinematic',
  className = '',
}: ImageBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current || prefersReducedMotion) {
        if (containerRef.current) {
          gsap.set(containerRef.current, { opacity: 1, scale: 1 });
        }
        return;
      }

      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          scale: 1.02,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full overflow-hidden
        bg-gradient-to-br from-stone-200 via-stone-150 to-stone-200
        ${aspectRatios[aspectRatio]}
        ${className}
      `}
      style={{ opacity: prefersReducedMotion ? 1 : 0 }}
    >
      {/* Subtle atmospheric overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 50% at 30% 40%, rgba(176, 137, 104, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 70% 70%, rgba(168, 162, 158, 0.08) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Optional label for development */}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-small text-stone-400 tracking-widest">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

