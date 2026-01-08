'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
  start?: string;
}

/**
 * Scroll-triggered reveal animation with luxurious timing.
 * Uses GSAP ScrollTrigger for precise control.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 1.2,
  y = 60,
  start = 'top 85%',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current) return;

      if (prefersReducedMotion) {
        gsap.set(containerRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, delay, duration, y, start] }
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ opacity: prefersReducedMotion ? 1 : 0 }}
    >
      {children}
    </div>
  );
}

/**
 * Staggered reveal for multiple children.
 * Each direct child will animate in sequence.
 */
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  duration?: number;
  y?: number;
  start?: string;
}

export function StaggerReveal({
  children,
  className,
  stagger = 0.15,
  duration = 1,
  y = 40,
  start = 'top 85%',
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.children;
      
      if (prefersReducedMotion) {
        gsap.set(elements, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, stagger, duration, y, start] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

