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

interface LocalConnectionProps {
  /** Image of local village or area */
  imageSrc?: string;
  imageAlt?: string;
}

/**
 * LocalConnection: Human scale and connection beyond the gate.
 * 
 * Counters isolation perception by reconnecting the home
 * to everyday life — village, community, convenience.
 */
export function LocalConnection({
  imageSrc,
  imageAlt = 'Pauatahanui village and inlet',
}: LocalConnectionProps) {
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
        {/* Intro copy */}
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
            Five minutes from everything that matters.
          </h2>
          
          <p 
            className="text-foreground text-base md:text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            Pauatahanui village sits just beyond the gate — a morning coffee, 
            a weekend market, neighbours who wave. The quiet here is chosen, 
            never imposed.
          </p>
        </div>

        {/* Image */}
        <div 
          ref={imageRef}
          className="mb-12 md:mb-16"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <div className="relative aspect-[21/9] overflow-hidden">
            {imageSrc ? (
              <Image
                src={imageSrc}
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

        {/* Proximity details - understated */}
        <div 
          ref={detailsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          {[
            { label: 'Village', value: '2 min' },
            { label: 'Wellington CBD', value: '25 min' },
            { label: 'Airport', value: '30 min' },
            { label: 'Schools', value: '10 min' },
          ].map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <p 
                className="text-muted text-sm uppercase tracking-widest mb-1"
                style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
              >
                {item.label}
              </p>
              <p 
                className="font-display text-heading text-xl md:text-2xl"
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
