'use client';

import Image from 'next/image';
import { ScrollReveal, StaggerReveal } from '@/components/animations';

interface DiptychProps {
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  microHeader?: string;
  copy?: string;
}

/**
 * Diptych section: asymmetric two-column layout.
 * Large image slightly off-centre on one side,
 * floating text vertically centred on the other.
 * 
 * Typography: micro-header with thesis copy below.
 * Mobile: image first, text below with premium spacing.
 */
export function Diptych({
  imageSrc,
  imageAlt = 'Estate grounds',
  imagePosition = 'right',
  microHeader = 'The Arrival',
  copy = "A gradual approach through mature grounds, framed by established palms, precedes the home's quiet reveal.",
}: DiptychProps) {
  const isImageRight = imagePosition === 'right';

  return (
    <section className="py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-5 md:px-8 lg:px-12">
        <div
          className={`
            grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-8 lg:gap-12 xl:gap-16 items-center
            ${isImageRight ? 'lg:grid-cols-[0.65fr_1fr]' : ''}
          `}
        >
          {/* Image - displayed first on mobile via DOM order */}
          <ScrollReveal 
            className={`order-first ${isImageRight ? 'lg:order-last' : ''}`}
            y={30}
            duration={1.4}
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </ScrollReveal>

          {/* Text content - vertically centred, near the image */}
          <div className="flex items-center">
            <StaggerReveal 
              className="space-y-6"
              y={24}
              stagger={0.18}
              duration={1.1}
            >
              {/* Micro-header */}
              <span className="block font-[family-name:var(--font-basis)] text-[0.6875rem] md:text-[0.75rem] uppercase tracking-[0.15em] text-foreground/50">
                {microHeader}
              </span>
              
              {/* Main copy */}
              <p className="text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] leading-[1.4] text-heading tracking-[-0.015em]">
                {copy}
              </p>
            </StaggerReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
