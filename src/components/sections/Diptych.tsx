'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface ArrivalPhase {
  image: string;
  imageAlt: string;
  copy: string;
}

const PHASES: [ArrivalPhase, ArrivalPhase] = [
  {
    image: '',
    imageAlt: 'Tree-lined driveway approaching the estate',
    copy: "A gradual approach through mature grounds, framed by established palms, precedes the home's quiet reveal.",
  },
  {
    image: '',
    imageAlt: 'Threshold view of the residence',
    copy: 'Architecture here is defined by proportion, light and outlook.',
  },
];

interface DiptychProps {
  /** Phase 1 image: palm-lined driveway / approach */
  imageSrc: string;
  imageAlt?: string;
  /** Phase 2 image: portrait threshold view */
  phase2ImageSrc?: string;
  phase2ImageAlt?: string;
}

/**
 * Arrival section: Two-phase sticky scroll experience.
 * 
 * Phase 1 (Approach): Main copy with driveway image
 * Phase 2 (Threshold): Secondary copy with portrait image
 * 
 * Crossfades between phases at ~50% scroll progress.
 * Layout remains constant: copy left, image right.
 */
export function Diptych({
  imageSrc,
  imageAlt,
  phase2ImageSrc,
  phase2ImageAlt,
}: DiptychProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);

  // Merge props with default phases
  const phases: [ArrivalPhase, ArrivalPhase] = [
    {
      ...PHASES[0],
      image: imageSrc || PHASES[0].image,
      imageAlt: imageAlt || PHASES[0].imageAlt,
    },
    {
      ...PHASES[1],
      image: phase2ImageSrc || PHASES[1].image,
      imageAlt: phase2ImageAlt || PHASES[1].imageAlt,
    },
  ];

  const hasImages = imageSrc || phase2ImageSrc;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Track scroll progress through section
  useEffect(() => {
    if (!hasMounted || !isDesktop || prefersReducedMotion) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress through section
      const scrolledIntoSection = -rect.top;
      const totalScrollDistance = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolledIntoSection / totalScrollDistance));
      
      // Phase transition at 50% (slightly earlier at 45% for smoother feel)
      const phaseFromProgress = progress >= 0.45 ? 1 : 0;
      
      if (phaseFromProgress !== currentPhase) {
        setCurrentPhase(phaseFromProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMounted, isDesktop, prefersReducedMotion, currentPhase]);

  // Mobile / reduced-motion: Static Phase 1 layout
  if (!hasMounted || !isDesktop || prefersReducedMotion) {
    return (
      <section className="py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="max-w-[85rem] mx-auto px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.65fr_1fr] gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Copy - left on desktop, below image on mobile */}
            <div className="flex items-center order-last lg:order-first">
              <p className="text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] leading-[1.4] text-heading tracking-[-0.015em]">
                {phases[0].copy}
              </p>
            </div>

            {/* Image - right on desktop, first on mobile */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] order-first lg:order-last">
              {phases[0].image ? (
                <Image
                  src={phases[0].image}
                  alt={phases[0].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              ) : (
                <div className="absolute inset-0 bg-surface flex items-center justify-center">
                  <span className="text-small text-muted tracking-widest">
                    {phases[0].imageAlt}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop: Sticky two-phase scroll
  // Section is 200vh tall (100vh per phase)
  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '200vh' }}
    >
      {/* Sticky container - stays fixed while scrolling through section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="h-full max-w-[85rem] mx-auto px-5 md:px-8 lg:px-12 flex items-center">
          <div className="grid grid-cols-[0.65fr_1fr] gap-12 xl:gap-16 items-center w-full">
            
            {/* Copy column - left */}
            <div className="flex items-center justify-center">
              <div className="relative w-full">
                {/* Phase 1 copy */}
                <p
                  className="text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] leading-[1.4] text-heading tracking-[-0.015em]"
                  style={{
                    opacity: currentPhase === 0 ? 1 : 0,
                    transform: currentPhase === 0 ? 'translateY(0)' : 'translateY(-8px)',
                    transition: 'opacity 400ms ease-out, transform 400ms ease-out',
                    position: currentPhase === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {phases[0].copy}
                </p>

                {/* Phase 2 copy */}
                <p
                  className="text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] leading-[1.4] text-heading tracking-[-0.015em]"
                  style={{
                    opacity: currentPhase === 1 ? 1 : 0,
                    transform: currentPhase === 1 ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 400ms ease-out, transform 400ms ease-out',
                    position: currentPhase === 1 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {phases[1].copy}
                </p>
              </div>
            </div>

            {/* Image column - right */}
            <div className="relative h-[75vh] flex items-center justify-center">
              {/* Phase 1 image */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: currentPhase === 0 ? 1 : 0,
                  transition: 'opacity 400ms ease-out',
                }}
              >
                <div className="relative w-full h-full">
                  {phases[0].image ? (
                    <Image
                      src={phases[0].image}
                      alt={phases[0].imageAlt}
                      fill
                      className="object-cover"
                      sizes="55vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-surface flex items-center justify-center">
                      <span className="text-small text-muted tracking-widest">
                        {phases[0].imageAlt}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Phase 2 image - portrait, contained with whitespace */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: currentPhase === 1 ? 1 : 0,
                  transition: 'opacity 400ms ease-out',
                }}
              >
                <div className="relative w-full h-full">
                  {phases[1].image ? (
                    <Image
                      src={phases[1].image}
                      alt={phases[1].imageAlt}
                      fill
                      className="object-contain"
                      sizes="55vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-surface flex items-center justify-center">
                      <span className="text-small text-muted tracking-widest">
                        {phases[1].imageAlt}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
