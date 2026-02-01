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

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LocalConnectionProps {
  /** Image source */
  imageSrc?: string;
  imageAlt?: string;
  /** @deprecated Use imageSrc instead */
  mapImageSrc?: string;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function LocalConnection({
  imageSrc,
  imageAlt = 'Pauatahanui village and inlet',
  mapImageSrc,
}: LocalConnectionProps) {
  // Support legacy mapImageSrc prop
  const displayImageSrc = imageSrc || mapImageSrc;
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([textRef.current, imageRef.current, detailsRef.current], { 
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
        imageRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.7'
      );

      tl.fromTo(
        detailsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section 
      ref={sectionRef}
      className="bg-surface py-24 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Intro copy - bridges property and place */}
        <div 
          ref={textRef}
          className="max-w-2xl mb-12 md:mb-16"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <h2 
            className="font-display font-light text-heading mb-6"
            style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              lineHeight: 1.15,
            }}
          >
            A private world - perfectly connected.
          </h2>
          
          <p 
            className="text-foreground text-base md:text-lg leading-relaxed mb-4"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            And while Pari Moana feels a world away, Pāuatahanui Village is right on its doorstep; morning coffee, inlet walks, a boutique movie house and a friendly local community, with a wide range of outdoor activities close by.
          </p>
          <p 
            className="text-foreground text-base md:text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            When you do need to venture further, Wellington City, the Hutt Valley and the Kāpiti Coast are all within easy reach.
          </p>
        </div>

        {/* Property Image */}
        <div 
          ref={imageRef}
          className="mb-12 md:mb-16"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            {displayImageSrc ? (
              <Image
                src={displayImageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-surface to-slate-50/30 flex items-center justify-center">
                <span className="text-small text-muted tracking-widest">
                  {imageAlt}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details grid - property attributes + proximity */}
        <div 
          ref={detailsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          {[
            { label: 'Village', value: '2 min' },
            { label: 'Porirua', value: '10 min' },
            { label: 'Wellington', value: '25 min' },
            { label: 'Airport', value: '30 min' },
          ].map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <p 
                className="text-muted text-sm uppercase tracking-widest mb-1"
                style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
              >
                {item.label}
              </p>
              <p className="font-display text-heading text-xl md:text-2xl">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
