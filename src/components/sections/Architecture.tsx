'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/components/animations';

/**
 * Heading options for the Architecture section.
 * Each option conveys architectural intent without being promotional.
 */
export type ArchitectureHeadingOption = 'A' | 'B' | 'C';

const HEADINGS: Record<ArchitectureHeadingOption, string> = {
  A: 'Architecture with intent',
  B: 'Designed for longevity',
  C: 'A considered response to place',
};

/**
 * Body copy statements - rendered separately, not as a paragraph.
 */
const STATEMENTS = [
  'The home is shaped by its site rather than imposed upon it.',
  'Orientation, rooflines and overhangs are carefully tuned to light, weather and privacy.',
  'Movement through the home is intuitive, allowing spaces to separate or connect without effort.',
  'Throughout, the architecture prioritises comfort, durability and ease over display.',
];

interface ArchitectureProps {
  /**
   * Select heading variant: A, B, or C
   * @default 'A'
   */
  headingOption?: ArchitectureHeadingOption;
  
  /**
   * Primary image: Long axial corridor with curved skylight
   */
  primaryImage: string;
  
  /**
   * Secondary image: Threshold moment with timber door opening to inlet
   */
  secondaryImage: string;
  
  /**
   * Supporting image: Long, low exterior elevation across the lawn
   */
  supportingImage: string;
}

/**
 * Architecture Section
 * 
 * A calm, editorial two-column layout communicating architectural intent.
 * Image-led left column, restrained text right. Not promotional—design-literate.
 * 
 * Desktop: Two-column with image column slightly dominant.
 * Mobile: Stacked—primary image, text, then secondary images.
 */
export function Architecture({
  headingOption = 'A',
  primaryImage,
  secondaryImage,
  supportingImage,
}: ArchitectureProps) {
  const heading = HEADINGS[headingOption];

  return (
    <section className="py-20 md:py-28 lg:py-36">
      <div className="max-w-[90rem] mx-auto px-5 md:px-8 lg:px-12">
        {/* Desktop: Two-column grid / Mobile: Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 xl:gap-24">
          
          {/* Left column: Images */}
          <ScrollReveal className="order-1 lg:order-1" y={40} duration={1.3}>
            <div className="space-y-10 md:space-y-14 lg:space-y-20">
              {/* Primary image: Axial corridor with curved skylight */}
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]">
                <Image
                  src={primaryImage}
                  alt="Long axial corridor with curved skylight, strong symmetry with light as a design element"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              </div>

              {/* Mobile: Text appears here (between primary and secondary images) */}
              <div className="lg:hidden">
                <TextContent heading={heading} />
              </div>

              {/* Secondary image: Threshold moment */}
              <div className="relative aspect-[16/10] md:aspect-[3/2]">
                <Image
                  src={secondaryImage}
                  alt="Threshold moment with timber door opening to the inlet, architecture framing landscape"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>

              {/* Supporting image: Exterior elevation */}
              <div className="relative aspect-[21/9] md:aspect-[2.5/1]">
                <Image
                  src={supportingImage}
                  alt="Long, low exterior elevation across the lawn, emphasising roofline and horizontal scale"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Right column: Text (desktop only, hidden on mobile) */}
          <div className="hidden lg:flex lg:items-start lg:pt-8 xl:pt-12 order-2">
            <ScrollReveal y={30} duration={1.1} delay={0.15}>
              <TextContent heading={heading} />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Text content component - used in both desktop and mobile positions.
 * Editorial typography, magazine-essay feel.
 */
function TextContent({ heading }: { heading: string }) {
  return (
    <div className="max-w-md lg:max-w-[26rem] xl:max-w-[28rem]">
      {/* Heading: Restrained and confident */}
      <h2 className="text-[1.625rem] md:text-[1.875rem] lg:text-[2.125rem] xl:text-[2.375rem] leading-[1.15] tracking-[-0.02em] text-heading mb-10 md:mb-12 lg:mb-14">
        {heading}
      </h2>

      {/* Body statements: Separated, not a paragraph */}
      <div className="space-y-6 md:space-y-7 lg:space-y-8">
        {STATEMENTS.map((statement, index) => (
          <p
            key={index}
            className="font-[family-name:var(--font-basis)] text-[1rem] md:text-[1.0625rem] lg:text-[1.125rem] leading-[1.65] text-foreground"
            style={{ maxWidth: '50ch' }}
          >
            {statement}
          </p>
        ))}
      </div>
    </div>
  );
}
