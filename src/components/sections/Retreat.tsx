'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RetreatProps {
  /** Primary image - bedroom or quiet space */
  primaryImage?: string;
  primaryImageAlt?: string;
  /** Secondary image - another private space */
  secondaryImage?: string;
  secondaryImageAlt?: string;
}

/**
 * Retreat: Privacy and separation without diagrams or plans.
 * 
 * Reassures families and multi-generational buyers
 * through imagery and restrained copy.
 */
export function Retreat({
  primaryImage,
  primaryImageAlt = 'Primary suite with morning light',
  secondaryImage,
  secondaryImageAlt = 'Guest wing living area',
}: RetreatProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([textRef.current, primaryRef.current, secondaryRef.current], { 
          opacity: 1, 
          y: 0 
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      tl.fromTo(
        primaryRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.6'
      );

      tl.fromTo(
        secondaryRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.9'
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section 
      ref={sectionRef}
      className="bg-surface pt-12 md:pt-16 lg:pt-20 pb-24 md:pb-32 lg:pb-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Copy - centered, minimal */}
        <div 
          ref={textRef}
          className="max-w-2xl mx-auto text-center mb-20 md:mb-28 lg:mb-36"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <p 
            className="font-display text-heading"
            style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              lineHeight: 1.4,
            }}
          >
            Private spaces are deliberately separated, offering calm, outlook and a sense of retreat from the main living areas.
          </p>
        </div>

        {/* Image grid - asymmetric for visual interest */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Primary image - larger */}
          <div 
            ref={primaryRef}
            className="lg:col-span-7"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={primaryImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-surface to-slate-50 flex items-center justify-center">
                  <span className="text-small text-muted tracking-widest text-center px-8">
                    {primaryImageAlt}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Secondary image - smaller, offset */}
          <div 
            ref={secondaryRef}
            className="lg:col-span-5 lg:pt-12 xl:pt-20"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {secondaryImage ? (
                <Image
                  src={secondaryImage}
                  alt={secondaryImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-surface to-slate-100 flex items-center justify-center">
                  <span className="text-small text-muted tracking-widest text-center px-8">
                    {secondaryImageAlt}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
