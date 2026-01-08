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
 * Hillbrook-style introduction with playful, staggered typography.
 * Creative text layout with mixed weights and italics.
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

      const lines = headlineRef.current?.querySelectorAll('.headline-line');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      if (lines) {
        tl.fromTo(
          lines,
          { opacity: 0, y: 80 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            ease: 'power3.out',
            stagger: 0.15
          }
        );
      }

      tl.fromTo(
        bodyRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section 
      ref={sectionRef}
      className="bg-stone-100 py-24 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Playful staggered headline - Hillbrook style */}
        <div 
          ref={headlineRef}
          className="relative"
        >
          {/* Line 1: "Your luxury escape" */}
          <div 
            className="headline-line"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <span 
              className="font-display font-light text-stone-900"
              style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1.1 }}
            >
              Your{' '}
            </span>
            <span 
              className="font-display font-light italic text-stone-900"
              style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1.1 }}
            >
              luxury escape
            </span>
          </div>

          {/* Line 2: "to disconnect" - indented */}
          <div 
            className="headline-line pl-[8%] md:pl-[15%]"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <span 
              className="font-display font-light text-stone-900"
              style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1.1 }}
            >
              to{' '}
            </span>
            <span 
              className="font-display font-light italic text-stone-900"
              style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1.1 }}
            >
              disconnect
            </span>
          </div>

          {/* Line 3: "and reconnect" - more indented */}
          <div 
            className="headline-line pl-[20%] md:pl-[35%]"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <span 
              className="font-display font-light text-stone-900"
              style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1.1 }}
            >
              and{' '}
            </span>
            <span 
              className="font-display font-light italic text-stone-900"
              style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1.1 }}
            >
              reconnect
            </span>
          </div>
        </div>

        {/* Body text and CTA - aligned right */}
        <div 
          ref={bodyRef}
          className="mt-12 md:mt-16 ml-auto max-w-lg md:max-w-md lg:max-w-lg"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <p className="text-stone-600 text-base md:text-lg leading-relaxed">
            Pari Moana is a luxury waterfront estate nestled on New Zealand's stunning coastline. 
            Available for exclusive private stays, this architectural retreat offers the perfect 
            setting for those seeking space, beauty, and absolute tranquility.
          </p>

          <a
            href="/the-home"
            className="inline-flex items-center gap-3 mt-8 group"
          >
            <span className="text-sm font-medium tracking-widest text-stone-900 uppercase">
              Book now
            </span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-bronze text-white transition-transform duration-300 group-hover:translate-x-1">
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
