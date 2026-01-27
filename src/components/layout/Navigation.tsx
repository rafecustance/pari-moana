'use client';

import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * Pill-shaped floating navigation for Pari Moana.
 * 
 * - Centered with rounded edges
 * - Full nav on load
 * - Horizontally collapses to CTA pill on scroll
 */
export function Navigation() {
  const [isCondensed, setIsCondensed] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsCondensed(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(
    () => {
      if (!linksRef.current || !pillRef.current) return;

      if (isCondensed) {
        // Collapse: fade out links and shrink width
        gsap.to(linksRef.current, {
          width: 0,
          opacity: 0,
          paddingLeft: 0,
          paddingRight: 0,
          display: 'none',
          duration: 0.4,
          ease: 'power3.inOut',
        });
      } else {
        // Expand: fade in links and restore width
        gsap.set(linksRef.current, { display: 'flex' });
        gsap.to(linksRef.current, {
          width: 'auto',
          opacity: 1,
          paddingLeft: 12,
          paddingRight: 8,
          duration: 0.4,
          ease: 'power3.inOut',
        });
      }
    },
    { dependencies: [isCondensed] }
  );

  return (
    <header
      ref={navRef}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      {/* Navigation pill */}
      <nav
        ref={pillRef}
        className="flex items-center py-2 pl-2 pr-2 rounded-full bg-background/95 backdrop-blur-md shadow-lg shadow-heading/5 border border-border/50"
        style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
      >
        {/* Nav links - collapses horizontally */}
        <div 
          ref={linksRef}
          className="hidden md:flex items-center overflow-hidden"
          style={{ paddingLeft: 12, paddingRight: 8 }}
        >
          <a 
            href="/the-home" 
            className="px-4 py-2 text-sm text-foreground hover:text-heading transition-colors duration-300 whitespace-nowrap"
          >
            The Home
          </a>
          <a 
            href="/gallery" 
            className="px-4 py-2 text-sm text-foreground hover:text-heading transition-colors duration-300 whitespace-nowrap"
          >
            Gallery
          </a>
          <a 
            href="/location" 
            className="px-4 py-2 text-sm text-foreground hover:text-heading transition-colors duration-300 whitespace-nowrap"
          >
            Location
          </a>
        </div>

        {/* CTA button */}
        <a
          href="#register"
          className="px-5 py-2.5 text-sm font-medium text-on-image bg-heading rounded-full hover:bg-foreground transition-colors duration-300 whitespace-nowrap shrink-0"
        >
          Register Interest
        </a>
      </nav>
    </header>
  );
}
