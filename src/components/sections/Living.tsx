'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/use-reduced-motion';

const CONTENT = {
  headline: 'Living spaces, seamlessly connected',
  body: 'The house opens to the garden on all sides, with decks and courtyard spaces - supporting both quiet moments and memorable gatherings.',
};

const DEFAULT_ALTS = [
  'Interior dining area with harbour views',
  'Sheltered terrace connecting indoor and outdoor spaces',
  'Fireplace glowing at dusk',
  'Evening interior warmth',
] as const;

interface LivingProps {
  /** Array of 4 image URLs */
  images?: [string, string, string, string];
  /** Array of 4 image alt texts */
  imageAlts?: [string, string, string, string];
}

/**
 * Living section: Static copy section followed by scroll-driven image carousel.
 * 
 * Structure:
 * - Text section (static, always visible)
 * - Image carousel with margins (sticky scroll, crossfading)
 */
export function Living({ images, imageAlts }: LivingProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentImage, setCurrentImage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  const alts = imageAlts || DEFAULT_ALTS;
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

  // Track scroll progress through carousel section
  useEffect(() => {
    if (!hasMounted || !isDesktop || prefersReducedMotion) return;

    const handleScroll = () => {
      if (!carouselRef.current) return;
      
      const rect = carouselRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const scrolledIntoSection = -rect.top;
      const totalScrollDistance = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolledIntoSection / totalScrollDistance));
      
      // Map progress to 4 images
      const imageIndex = Math.min(3, Math.floor(progress * 4));
      
      if (imageIndex !== currentImage) {
        setCurrentImage(imageIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMounted, isDesktop, prefersReducedMotion, currentImage]);

  // Mobile / reduced-motion: Static layout
  if (!hasMounted || !isDesktop || prefersReducedMotion) {
    return (
      <section className="py-16 md:py-24 bg-surface">
        {/* Intro text */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 mb-16 md:mb-24 text-center">
          <h2 className="font-display font-light text-heading text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] leading-[1.2] tracking-[-0.02em] mb-6">
            {CONTENT.headline}
          </h2>
          <p 
            className="text-[1.0625rem] md:text-[1.125rem] lg:text-[1.1875rem] leading-[1.7] text-foreground/85 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            {CONTENT.body}
          </p>
        </div>

        {/* Images - stacked on mobile with margins */}
        <div className="space-y-8 md:space-y-12 px-5 md:px-8">
          {[0, 1, 2, 3].map((index) => (
            images?.[index] && (
              <div key={index} className="relative aspect-[16/10] w-full">
                <Image
                  src={images[index]}
                  alt={alts[index] ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) calc(100vw - 40px), calc(100vw - 64px)"
                />
              </div>
            )
          ))}
        </div>
      </section>
    );
  }

  // Desktop: Static text section + sticky scroll carousel with margins
  return (
    <>
      {/* Text section - static with contrasting background */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 bg-surface">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h2 
            className="font-display font-light text-heading leading-[1.15] mb-6"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
          >
            {CONTENT.headline}
          </h2>
          <p 
            className="text-foreground/85 leading-relaxed max-w-2xl mx-auto"
            style={{ 
              fontSize: 'clamp(1.0625rem, 1.5vw, 1.1875rem)',
              fontFamily: 'var(--font-basis), system-ui, sans-serif',
            }}
          >
            {CONTENT.body}
          </p>
        </div>
      </section>

      {/* Image carousel - sticky scroll with margins */}
      <div
        ref={carouselRef}
        className="relative bg-surface"
        style={{ height: '300vh' }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-surface">
          <div className="relative w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] lg:w-[calc(100%-8rem)] h-[80vh] mx-auto">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="absolute inset-0"
                style={{
                  opacity: currentImage === index ? 1 : 0,
                  transition: 'opacity 800ms ease-out',
                }}
              >
                {images?.[index] ? (
                  <Image
                    src={images[index]}
                    alt={alts[index] ?? ''}
                    fill
                    className="object-cover"
                    sizes="calc(100vw - 8rem)"
                    priority={index === 0}
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface flex items-center justify-center">
                    <span className="text-small text-muted tracking-widest text-center px-4">
                      {alts[index] ?? ''}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Progress indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-0.5 w-12"
                  style={{
                    backgroundColor: currentImage === index 
                      ? (hasImages ? 'var(--on-image)' : 'var(--heading)')
                      : (hasImages ? 'rgba(248, 248, 244, 0.3)' : 'rgba(34, 36, 33, 0.2)'),
                    transition: 'background-color 400ms ease-out',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
