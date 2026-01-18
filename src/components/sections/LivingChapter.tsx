'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface Step {
  image: string;
  imageAlt: string;
  text: string;
}

const STEPS: Step[] = [
  {
    image: '',
    imageAlt: 'Interior dining with landscape beyond',
    text: 'Spaces here are designed to evolve through the day.',
  },
  {
    image: '',
    imageAlt: 'Interior to terrace threshold with fire lit',
    text: 'Open and social when shared, quiet and intimate when needed.',
  },
  {
    image: '',
    imageAlt: 'Covered terrace at dusk',
    text: 'Always connected to light, landscape and each other.',
  },
];

interface LivingChapterProps {
  images?: [string, string, string];
}

/**
 * LivingChapter: Scroll-driven narrative section.
 * 
 * Uses sticky positioning and scroll progress to transition between steps.
 * Much more reliable than wheel-event-based scroll jacking.
 */
export function LivingChapter({ images }: LivingChapterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);

  const steps = STEPS.map((step, i) => ({
    ...step,
    image: images?.[i] || step.image,
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
      
      // Calculate how far we've scrolled through the section
      // When rect.top = 0, we're at the start
      // When rect.bottom = viewportHeight, we're at the end
      const scrolledIntoSection = -rect.top;
      const totalScrollDistance = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolledIntoSection / totalScrollDistance));
      
      // Map progress to steps (0-33% = step 0, 33-66% = step 1, 66-100% = step 2)
      const stepFromProgress = Math.min(2, Math.floor(progress * 3));
      
      if (stepFromProgress !== currentStep) {
        setCurrentStep(stepFromProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMounted, isDesktop, prefersReducedMotion, currentStep]);

  // Mobile/reduced-motion: Static stacked layout
  if (!hasMounted || !isDesktop || prefersReducedMotion) {
    return (
      <section className="py-16 md:py-24">
        <div className="space-y-16 md:space-y-24">
          {steps.map((step, index) => (
            <div key={index} className="space-y-6">
              <div className="relative aspect-[16/10] w-full bg-surface">
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-small text-muted tracking-widest">
                      {step.imageAlt}
                    </span>
                  </div>
                )}
              </div>
              <div className="content-narrow">
                <p className="text-body-lg text-heading">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop: Sticky scroll-driven layout
  // Section is 300vh tall (100vh per step), sticky container stays in view
  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '300vh' }}
    >
      {/* Sticky container - stays fixed in viewport while scrolling through section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Images - all absolutely positioned for crossfade */}
        <div className="absolute inset-0">
          {steps.map((step, index) => (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                opacity: currentStep === index ? 1 : 0,
                transition: 'opacity 500ms ease-out',
              }}
            >
              {step.image ? (
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-border via-surface to-border flex items-center justify-center">
                  <span className="text-small text-muted tracking-widest">
                    {step.imageAlt}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-end pointer-events-none">
          <div className="w-full pb-16 lg:pb-24">
            <div className="content-wide">
              <div className="max-w-md lg:max-w-lg">
                {/* Text container */}
                <div className="relative h-20">
                  {steps.map((step, index) => (
                    <p
                      key={index}
                      className={`
                        absolute inset-x-0 top-0
                        text-[1.375rem] lg:text-[1.625rem] leading-[1.35]
                        ${hasImages ? 'text-on-image' : 'text-heading'}
                      `}
                      style={{
                        opacity: currentStep === index ? 1 : 0,
                        transform: currentStep === index ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'opacity 450ms ease-out, transform 450ms ease-out',
                        transitionDelay: currentStep === index ? '80ms' : '0ms',
                      }}
                    >
                      {step.text}
                    </p>
                  ))}
                </div>

                {/* Step indicators */}
                <div className="flex gap-2 mt-6">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className="h-0.5 w-8"
                      style={{
                        backgroundColor: currentStep === index 
                          ? (hasImages ? 'var(--on-image)' : 'var(--heading)')
                          : (hasImages ? 'rgba(248, 248, 244, 0.3)' : 'rgba(34, 36, 33, 0.3)'),
                        transition: 'background-color 300ms ease-out',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
