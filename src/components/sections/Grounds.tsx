'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Slide {
  image: string;
  alt: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    image: '',
    alt: 'Established gardens with mature plantings',
  },
  {
    image: '',
    alt: 'Sheltered outdoor terraces',
  },
  {
    image: '',
    alt: 'Quiet outdoor living spaces',
  },
];

interface GroundsProps {
  /** Array of slides with image, label and alt text */
  slides?: Slide[];
  /** Headline text */
  headline?: string;
  /** Body copy */
  body?: string;
}

/**
 * Grounds: Carousel showcasing outdoor spaces.
 * 
 * Full-width carousel with peek of adjacent slides,
 * labels, and arrow navigation.
 */
export function Grounds({
  slides = DEFAULT_SLIDES,
  headline = 'Designed for life outdoors',
  body = "A series of outdoor spaces sit around the home, offering shelter and flexibility for daily use. Open to northern light and protected from the elements, they're usable across seasons.",
}: GroundsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const springX = useSpring(x, { 
    stiffness: 300, 
    damping: 30,
    mass: 0.8,
  });

  // Calculate slide width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        // Main slide takes ~85% of viewport with gaps
        const viewportWidth = window.innerWidth;
        const mainWidth = Math.min(viewportWidth * 0.85, viewportWidth - 120);
        setSlideWidth(mainWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Update x position when slide changes
  useEffect(() => {
    if (slideWidth > 0) {
      const gap = 16;
      x.set(-currentSlide * (slideWidth + gap));
    }
  }, [currentSlide, slideWidth, x]);

  const goToSlide = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(slides.length - 1, index));
    setCurrentSlide(newIndex);
  }, [slides.length]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = slideWidth * 0.2;
      const velocity = info.velocity.x;
      
      if (Math.abs(velocity) > 500) {
        // Fast swipe
        if (velocity > 0 && currentSlide > 0) {
          goToSlide(currentSlide - 1);
        } else if (velocity < 0 && currentSlide < slides.length - 1) {
          goToSlide(currentSlide + 1);
        }
      } else if (Math.abs(info.offset.x) > threshold) {
        // Slow drag past threshold
        if (info.offset.x > 0 && currentSlide > 0) {
          goToSlide(currentSlide - 1);
        } else if (info.offset.x < 0 && currentSlide < slides.length - 1) {
          goToSlide(currentSlide + 1);
        }
      }
    },
    [currentSlide, goToSlide, slideWidth, slides.length]
  );

  // GSAP entrance animation
  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([textRef.current, carouselRef.current], { opacity: 1, y: 0 });
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
        textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      tl.fromTo(
        carouselRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.6'
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  const gap = 16;

  return (
    <section 
      ref={sectionRef}
      className="bg-background pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24 lg:pb-32 overflow-hidden"
    >
      {/* Copy - centered above carousel */}
      <div 
        ref={textRef}
        className="max-w-3xl mx-auto px-6 md:px-12 text-center mb-16 md:mb-20 lg:mb-24"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <h2 
          className="font-display font-light text-heading mb-6"
          style={{ 
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', 
            lineHeight: 1.15,
          }}
        >
          {headline}
        </h2>
        
        <p 
          className="text-foreground/85 leading-relaxed"
          style={{ 
            fontSize: 'clamp(1.0625rem, 1.5vw, 1.1875rem)',
            fontFamily: 'var(--font-basis), system-ui, sans-serif',
          }}
        >
          {body}
        </p>
      </div>

      {/* Carousel */}
      <div 
        ref={carouselRef}
        className="relative"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{ 
            x: springX,
            paddingLeft: `calc((100vw - ${slideWidth}px) / 2)`,
            gap: `${gap}px`,
          }}
          drag="x"
          dragConstraints={{
            left: -(slides.length - 1) * (slideWidth + gap),
            right: 0,
          }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="relative flex-shrink-0"
              style={{ width: slideWidth }}
              animate={{
                scale: currentSlide === index ? 1 : 0.95,
                opacity: currentSlide === index ? 1 : 0.6,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {slide.image ? (
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="85vw"
                    priority={index === 0}
                    draggable={false}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-surface to-stone-100 flex items-center justify-center">
                    <span className="text-small text-muted tracking-widest text-center px-8">
                      {slide.alt}
                    </span>
                  </div>
                )}

                {/* Navigation arrows - bottom right, only on current slide */}
                {currentSlide === index && (
                  <div className="absolute bottom-6 right-6 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSlide(currentSlide - 1);
                      }}
                      disabled={currentSlide === 0}
                      className="w-11 h-11 rounded-full bg-on-image/90 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-on-image disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Previous slide"
                    >
                      <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className="text-heading"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSlide(currentSlide + 1);
                      }}
                      disabled={currentSlide === slides.length - 1}
                      className="w-11 h-11 rounded-full bg-on-image/90 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-on-image disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Next slide"
                    >
                      <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className="text-heading"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
