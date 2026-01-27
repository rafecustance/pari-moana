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

interface FlexibilityProps {
  /** Image showing adaptable space */
  imageSrc?: string;
  imageAlt?: string;
}

/**
 * Flexibility: Adaptability framed as freedom, not potential works.
 * 
 * Subtly addresses future thinking without technical language.
 */
export function Flexibility({
  imageSrc,
  imageAlt = 'Detached studio with natural light',
}: FlexibilityProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([contentRef.current, imageRef.current], { opacity: 1, y: 0 });
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
        contentRef.current,
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
      className="bg-surface py-24 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy - left side */}
          <div 
            ref={contentRef}
            className="order-last lg:order-first"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <h2 
              className="font-display font-light text-heading mb-6"
              style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                lineHeight: 1.15,
              }}
            >
              Room for life to change.
            </h2>
            
            <p 
              className="text-foreground text-base md:text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
            >
              A separate studio sits quietly at the edge of the garden. 
              Office, guest suite, teenage retreat — it asks no questions 
              and answers to whatever you need.
            </p>
          </div>

          {/* Image - right side */}
          <div 
            ref={imageRef}
            className="order-first lg:order-last"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-surface to-slate-50 flex items-center justify-center">
                  <span className="text-small text-muted tracking-widest text-center px-8">
                    {imageAlt}
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
