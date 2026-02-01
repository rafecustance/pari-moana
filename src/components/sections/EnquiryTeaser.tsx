'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/use-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

interface EnquiryTeaserProps {
  imageSrc?: string;
}

/**
 * Full-viewport closing hero section.
 * Sunset/dusk imagery with emotional, not transactional, messaging.
 * Creates a sense of rarity and invitation.
 */
export function EnquiryTeaser({ 
  imageSrc = 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/twilight-1.webp' 
}: EnquiryTeaserProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Subtle parallax on the image
      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Content reveal on scroll
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Image background with warm overlay */}
      <div 
        ref={imageRef}
        className="absolute inset-0 scale-110"
        style={{ top: '-10%', bottom: '-10%' }}
      >
        <Image
          src={imageSrc}
          alt="Evening light across Pari Moana"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Warm dusk gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(34, 36, 33, 0.1) 0%,
                rgba(34, 36, 33, 0.35) 50%,
                rgba(34, 36, 33, 0.65) 100%
              ),
              linear-gradient(
                to right,
                rgba(137, 122, 95, 0.08) 0%,
                transparent 50%,
                rgba(137, 122, 95, 0.08) 100%
              )
            `
          }}
        />
      </div>

      {/* Content - centered with generous breathing room */}
      <div 
        ref={contentRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-12 pb-24"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <div id="register" className="max-w-2xl text-center scroll-mt-24 mt-16 md:mt-24">
          {/* Eyebrow */}
          <p 
            className="text-on-image/70 mb-4 uppercase tracking-widest"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-basis), system-ui, sans-serif',
            }}
          >
            Open Homes Commencing Soon
          </p>
          
          {/* Statement */}
          <p 
            className="font-display text-on-image mb-6 max-w-3xl mx-auto"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              fontWeight: 300,
              textShadow: '0 2px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            Homes like this are seldom created and rarely offered.
          </p>
          
          {/* Supporting copy */}
          <p 
            className="text-on-image/80 mb-10 max-w-xl mx-auto"
            style={{
              fontSize: 'clamp(0.9375rem, 1.2vw, 1.0625rem)',
              lineHeight: 1.7,
              fontFamily: 'var(--font-basis), system-ui, sans-serif',
            }}
          >
            Register to receive the full information pack and priority invitations to private viewings and upcoming open homes.
          </p>

          {/* Email capture form */}
          <form 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-on-image placeholder:text-on-image/50 focus:outline-none focus:border-white/40 transition-colors duration-300"
              style={{ 
                fontFamily: 'var(--font-basis), system-ui, sans-serif',
                fontSize: '0.9375rem',
              }}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 font-medium text-heading bg-on-image rounded-full hover:bg-white transition-colors duration-300 whitespace-nowrap"
              style={{ 
                fontFamily: 'var(--font-basis), system-ui, sans-serif',
                fontSize: '0.9375rem',
              }}
            >
              Register Interest
            </button>
          </form>
          
          {/* Privacy note */}
          <p 
            className="text-on-image/50 mt-6"
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-basis), system-ui, sans-serif',
            }}
          >
            We respect your privacy. Details shared only with the appointed agent.
          </p>
        </div>
      </div>

    </section>
  );
}
