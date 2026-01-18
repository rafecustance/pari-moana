'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Introduction section with balanced two-column layout.
 * Headline and body text aligned horizontally for visual cohesion.
 */
export function Introduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([headlineRef.current, bodyRef.current], { opacity: 1, y: 0 });
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
        headlineRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );

      tl.fromTo(
        bodyRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.8'
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Headline - left side */}
          <div 
            ref={headlineRef}
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <h2 
              className="font-display font-light text-heading"
              style={{ 
                fontSize: 'clamp(2.375rem, 5.5vw, 3.75rem)', 
                lineHeight: 1.15,
              }}
            >
              Where days unfold{' '}
              <em className="italic">differently</em>
            </h2>
          </div>

          {/* Body text - right side */}
          <div 
            ref={bodyRef}
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <p 
              className="text-foreground text-base md:text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
            >
              Set above the Pauatahanui Inlet, Pari Moana offers a rare sense of space and seclusion without isolation. The home is shaped around light, outlook and ease, creating an environment that encourages both connection and quiet retreat.
            </p>
            
            <p 
              className="text-foreground text-base md:text-lg leading-relaxed mt-6"
              style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
            >
              Here, life moves with the rhythm of the landscape; mornings by the water, long afternoons drifting between inside and out, and evenings defined by calm and privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
