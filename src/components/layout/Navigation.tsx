'use client';

import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * Floating CTA pill for Pari Moana.
 * 
 * - Appears after scrolling past the hero section
 * - Hides when the EnquiryTeaser section is visible
 * - Fades in/out with a smooth animation
 */
export function Navigation() {
  const [isPastHero, setIsPastHero] = useState(false);
  const [isEnquiryVisible, setIsEnquiryVisible] = useState(false);
  const pillRef = useRef<HTMLElement>(null);

  // Track scroll position (past hero)
  useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 0.8;
      setIsPastHero(window.scrollY > heroThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track EnquiryTeaser visibility with Intersection Observer
  useEffect(() => {
    const registerSection = document.getElementById('register');
    if (!registerSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsEnquiryVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(registerSection);
    return () => observer.disconnect();
  }, []);

  const isVisible = isPastHero && !isEnquiryVisible;

  useGSAP(
    () => {
      if (!pillRef.current) return;

      if (isVisible) {
        // Fade in and slide down
        gsap.fromTo(
          pillRef.current,
          { opacity: 0, y: -20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.4, 
            ease: 'power3.out',
            pointerEvents: 'auto',
          }
        );
      } else {
        // Fade out and slide up
        gsap.to(pillRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power3.in',
          pointerEvents: 'none',
        });
      }
    },
    { dependencies: [isVisible] }
  );

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        ref={pillRef}
        className="opacity-0 flex items-center gap-3 rounded-full bg-heading/95 backdrop-blur-md shadow-lg shadow-heading/10 px-6 py-3"
        style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
      >
        <span className="text-sm text-on-image/60 whitespace-nowrap hidden sm:inline">
          Final open home
        </span>
        <span className="text-on-image/25 hidden sm:inline select-none">·</span>
        <span className="text-sm text-on-image/90 whitespace-nowrap">
          Sun 1 March, 11am
        </span>
      </nav>
    </header>
  );
}
