'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface Moment {
  image: string;
  imageAlt: string;
  caption: string;
}

const MOMENTS: Moment[] = [
  {
    image: '',
    imageAlt: 'Terrace set for lunch with harbour views',
    caption: 'Long lunches.',
  },
  {
    image: '',
    imageAlt: 'Golden hour settling over the terrace',
    caption: 'Dusk settling.',
  },
  {
    image: '',
    imageAlt: 'Evening on the terrace with fire lit',
    caption: 'Evenings that stretch on.',
  },
];

// Chapter intro - revealed before carousel
const INTRO = {
  heading: 'Life centred outdoors',
  body: 'Outdoor spaces form the heart of the home; suited to long lunches, quiet mornings and evenings that linger. Sheltered and private, they allow life to move easily between inside and out, with the landscape always in view.',
};

interface OutdoorLivingProps {
  images?: [string, string, string];
}

/**
 * OutdoorLiving: Scroll-triggered reveal into image carousel.
 * 
 * Phases:
 * - Intro (0-20%): Text on solid background
 * - Reveal (20-35%): Image fades in, text fades out
 * - Carousel (35-100%): 3 images with captions, crossfading
 */
export function OutdoorLiving({ images }: OutdoorLivingProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);

  const moments = MOMENTS.map((moment, i) => ({
    ...moment,
    image: images?.[i] || moment.image,
  }));

  const hasImages = images && images.some(img => img);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Track scroll progress through section
  useEffect(() => {
    if (!hasMounted || !isDesktop || prefersReducedMotion) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const scrolledIntoSection = -rect.top;
      const totalScrollDistance = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolledIntoSection / totalScrollDistance));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMounted, isDesktop, prefersReducedMotion]);

  // Derive states from scroll progress
  // Intro: 0-20%, Reveal: 20-35%, Carousel: 35-100%
  const introOpacity = scrollProgress < 0.2 
    ? 1 
    : scrollProgress < 0.35 
      ? 1 - ((scrollProgress - 0.2) / 0.15) 
      : 0;
  
  const imageRevealOpacity = scrollProgress < 0.2 
    ? 0 
    : scrollProgress < 0.35 
      ? (scrollProgress - 0.2) / 0.15 
      : 1;

  // Map carousel progress (35-100%) to 3 moments
  const carouselProgress = scrollProgress < 0.35 
    ? 0 
    : (scrollProgress - 0.35) / 0.65;
  const currentMoment = Math.min(2, Math.floor(carouselProgress * 3));
  
  // Show captions only after reveal is complete
  const showCaptions = scrollProgress >= 0.35;

  // Mobile/reduced-motion: Static stacked layout
  if (!hasMounted || !isDesktop || prefersReducedMotion) {
    return (
      <section className="py-16 md:py-24">
        {/* Intro text */}
        <div className="content-narrow mb-16 md:mb-24 text-center">
          <h2 className="font-display text-[1.75rem] md:text-[2.25rem] text-heading leading-[1.2] mb-4">
            {INTRO.heading}
          </h2>
          <p className="text-body text-foreground max-w-xl mx-auto">
            {INTRO.body}
          </p>
        </div>

        {/* Images with captions */}
        <div className="space-y-16 md:space-y-24">
          {moments.map((moment, index) => (
            <div key={index} className="space-y-6">
              <div className="relative aspect-[16/10] w-full bg-surface">
                {moment.image ? (
                  <Image
                    src={moment.image}
                    alt={moment.imageAlt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-900/20 via-surface to-orange-900/20">
                    <span className="text-small text-muted tracking-widest">
                      {moment.imageAlt}
                    </span>
                  </div>
                )}
              </div>
              <div className="content-narrow">
                <p className="text-body-lg text-heading italic font-display">{moment.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop: Scroll-triggered reveal into carousel
  // 400vh = intro/reveal phase + 3 carousel steps
  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '400vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layer 1: Solid background */}
        <div className="absolute inset-0 bg-surface" />

        {/* Layer 2: Images - fade in during reveal, crossfade during carousel */}
        <div 
          className="absolute inset-0"
          style={{ opacity: imageRevealOpacity }}
        >
          {moments.map((moment, index) => (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                opacity: currentMoment === index ? 1 : 0,
                transition: 'opacity 800ms ease-out',
              }}
            >
              {moment.image ? (
                <Image
                  src={moment.image}
                  alt={moment.imageAlt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              ) : (
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: index === 0 
                      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgb(241, 242, 235) 50%, rgba(251, 191, 36, 0.05) 100%)'
                      : index === 1
                      ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgb(241, 242, 235) 50%, rgba(234, 88, 12, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(30, 41, 59, 0.2) 0%, rgb(241, 242, 235) 50%, rgba(51, 65, 85, 0.15) 100%)'
                  }}
                >
                  <span className="text-small text-muted tracking-widest">
                    {moment.imageAlt}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Layer 3: Intro text - centered, fades out during reveal */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            opacity: introOpacity,
            transform: `translateY(${(1 - introOpacity) * -20}px)`,
            transition: 'transform 100ms ease-out',
          }}
        >
          <div className="max-w-2xl px-6 text-center">
            <h2 
              className="font-display text-heading leading-[1.15] mb-6"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
            >
              {INTRO.heading}
            </h2>
            <p 
              className="text-foreground leading-relaxed"
              style={{ fontSize: 'clamp(1.0625rem, 1.5vw, 1.1875rem)' }}
            >
              {INTRO.body}
            </p>
          </div>
        </div>

        {/* Layer 4: Captions - appear after reveal, centered like original */}
        {showCaptions && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="relative">
                {moments.map((moment, index) => (
                  <p
                    key={index}
                    className={`
                      font-display italic
                      ${hasImages ? 'text-on-image' : 'text-heading'}
                    `}
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 4rem)',
                      lineHeight: 1.2,
                      opacity: currentMoment === index ? 1 : 0,
                      position: index === 0 ? 'relative' : 'absolute',
                      top: 0,
                      left: '50%',
                      transform: currentMoment === index 
                        ? 'translateX(-50%) translateY(0)' 
                        : 'translateX(-50%) translateY(12px)',
                      transition: 'opacity 600ms ease-out, transform 600ms ease-out',
                      transitionDelay: currentMoment === index ? '150ms' : '0ms',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {moment.caption}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress indicators - appear after reveal */}
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3"
          style={{
            opacity: showCaptions ? 1 : 0,
            transition: 'opacity 400ms ease-out',
          }}
        >
          {moments.map((_, index) => (
            <div
              key={index}
              className="h-0.5 w-12"
              style={{
                backgroundColor: currentMoment === index 
                  ? (hasImages ? 'var(--on-image)' : 'var(--heading)')
                  : (hasImages ? 'rgba(248, 248, 244, 0.3)' : 'rgba(34, 36, 33, 0.2)'),
                transition: 'background-color 400ms ease-out',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
