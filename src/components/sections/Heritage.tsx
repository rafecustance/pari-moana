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

interface HeritageProps {
  /** Image source URL */
  imageSrc: string;
  /** Image alt text */
  imageAlt?: string;
}

/**
 * Heritage section: Copy left, image right layout.
 * 
 * Follows the visual composition of the Diptych component
 * but as a single static presentation without scroll phases.
 */
export function Heritage({ imageSrc, imageAlt = 'Architectural detail of the residence' }: HeritageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([copyRef.current, imageRef.current], { opacity: 1, y: 0 });
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
        copyRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      tl.fromTo(
        imageRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.7'
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[85rem] mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_1fr] gap-8 lg:gap-16 xl:gap-20 items-center">
          {/* Copy - left on desktop, below image on mobile */}
          <div 
            ref={copyRef}
            className="flex flex-col justify-center order-last lg:order-first"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <h2 className="font-display font-light text-heading text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] leading-[1.2] tracking-[-0.02em] mb-6">
              A Home shaped by design thinking
            </h2>
            <p 
              className="text-[1.0625rem] md:text-[1.125rem] lg:text-[1.1875rem] leading-[1.7] text-foreground/85"
              style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
            >
              Evolved and refined by designer-owners, the house reflects a deep understanding of light, proportion, and everyday liveability.
            </p>
          </div>

          {/* Image - right on desktop, first on mobile */}
          <div 
            ref={imageRef}
            className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] order-first lg:order-last w-full lg:w-[85%] lg:ml-auto"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            ) : (
              <div className="absolute inset-0 bg-surface flex items-center justify-center">
                <span className="text-small text-muted tracking-widest">
                  {imageAlt}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
