'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface HeroFullProps {
  imageSrc?: string;
}

/**
 * Full-viewport hero section for Pari Moana.
 * 
 * Hillbrook-style: massive full-width typography with
 * solid cream color, positioned at the bottom.
 */
export function HeroFull({ 
  imageSrc = '/hero.jpg'
}: HeroFullProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(curtainRef.current, { yPercent: -100 });
        gsap.set(titleRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.3 });

      // Curtain lifts to reveal image
      tl.to(
        curtainRef.current,
        { 
          yPercent: -100, 
          duration: 1.8, 
          ease: 'power4.inOut'
        }
      )
      // Subtle scale settle on image
      .fromTo(
        imageRef.current,
        { scale: 1.05 },
        { scale: 1, duration: 2.5, ease: 'power2.out' },
        '-=1.4'
      )
      // Title reveal - rises from bottom
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' },
        '-=1.8'
      );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-surface"
    >
      {/* Curtain - lifts up to reveal */}
      <div 
        ref={curtainRef}
        className="absolute inset-0 z-20 bg-surface"
        aria-hidden="true"
      />

      {/* Image background */}
      <div 
        ref={imageRef}
        className="absolute inset-0"
      >
        <Image
          src={imageSrc}
          alt="Pari Moana - Aerial view of the estate"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Giant title - bottom, full width, hugging bottom edge */}
      <div 
        ref={titleRef}
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <h1 
          className="font-display font-light text-center whitespace-nowrap select-none w-full"
          style={{
            fontSize: 'clamp(5rem, 19vw, 24rem)',
            lineHeight: 0.8,
            letterSpacing: '-0.03em',
            transform: 'translateY(12%)',
            color: 'rgb(241, 242, 235)',
          }}
        >
          Pari Moana
        </h1>
      </div>
    </section>
  );
}
