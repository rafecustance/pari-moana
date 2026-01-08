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
      if (!linksRef.current) return;

      if (isCondensed) {
        // Collapse: fade out links and shrink width
        gsap.to(linksRef.current, {
          width: 0,
          opacity: 0,
          paddingLeft: 0,
          paddingRight: 0,
          duration: 0.5,
          ease: 'power3.inOut',
        });
      } else {
        // Expand: fade in links and restore width
        gsap.to(linksRef.current, {
          width: 'auto',
          opacity: 1,
          paddingLeft: 16,
          paddingRight: 16,
          duration: 0.5,
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
        className="flex items-center gap-2 px-2 py-2 rounded-full bg-stone-50/95 backdrop-blur-md shadow-lg shadow-stone-900/5 border border-stone-200/50"
      >
        {/* Logo */}
        <a 
          href="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors duration-300 shrink-0"
        >
          <span className="font-display text-lg text-stone-800">PM</span>
        </a>

        {/* Nav links - collapses horizontally */}
        <div 
          ref={linksRef}
          className="hidden md:flex items-center gap-1 overflow-hidden"
          style={{ paddingLeft: 16, paddingRight: 16 }}
        >
          <a 
            href="/the-home" 
            className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors duration-300 whitespace-nowrap"
          >
            The Home
          </a>
          <a 
            href="/gallery" 
            className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors duration-300 whitespace-nowrap"
          >
            Gallery
          </a>
          <a 
            href="/location" 
            className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors duration-300 whitespace-nowrap"
          >
            Location
          </a>
        </div>

        {/* CTA button */}
        <a
          href="/enquiry"
          className="px-5 py-2.5 text-sm font-medium text-stone-50 bg-stone-900 rounded-full hover:bg-stone-800 transition-colors duration-300 whitespace-nowrap shrink-0"
        >
          Book Private Viewing
        </a>
      </nav>
    </header>
  );
}
