'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface IntroductionProps {
  /** Optional video source URL */
  videoSrc?: string;
  /** Optional video poster image */
  videoPoster?: string;
}

/**
 * Introduction section with balanced two-column layout.
 * Headline and body text aligned horizontally for visual cohesion.
 * Optionally includes a video below the text.
 */
export function Introduction({ videoSrc, videoPoster }: IntroductionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([headlineRef.current, bodyRef.current, videoContainerRef.current], { opacity: 1, y: 0 });
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

      if (videoContainerRef.current) {
        tl.fromTo(
          videoContainerRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
          '-=0.4'
        );
      }
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
          </div>
        </div>

        {/* Video - below text */}
        {videoSrc && (
          <div
            ref={videoContainerRef}
            className="relative overflow-hidden rounded-sm mt-20 md:mt-32"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={videoPoster}
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '16/9' }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Play/Pause button - bottom right */}
            <button
              onClick={togglePlay}
              className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center justify-center w-12 h-12 rounded-full bg-heading/80 backdrop-blur-sm text-on-image hover:bg-heading transition-colors duration-300"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
