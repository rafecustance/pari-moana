'use client';

import { ScrollReveal, StaggerReveal } from '@/components/animations';

interface TextBlockProps {
  eyebrow?: string;
  heading: string;
  body: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Text block for use alongside or between image blocks.
 * Restrained, editorial typography with generous whitespace.
 */
export function TextBlock({
  eyebrow,
  heading,
  body,
  align = 'left',
}: TextBlockProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <section className="section-padding">
      <div className={`content-narrow ${alignmentClasses[align]}`}>
        <StaggerReveal className="space-y-6">
          {eyebrow && (
            <span className="block text-small text-accent tracking-widest">
              {eyebrow}
            </span>
          )}
          
          <h2 className="text-heading font-display text-heading">
            {heading}
          </h2>
          
          <p className="text-body text-foreground max-w-xl leading-relaxed">
            {body}
          </p>
        </StaggerReveal>
      </div>
    </section>
  );
}

/**
 * Split layout: image placeholder on one side, text on the other.
 */
interface SplitBlockProps {
  eyebrow?: string;
  heading: string;
  body: string;
  imagePosition?: 'left' | 'right';
  imageLabel?: string;
}

export function SplitBlock({
  eyebrow,
  heading,
  body,
  imagePosition = 'left',
  imageLabel,
}: SplitBlockProps) {
  return (
    <section className="section-padding">
      <div className="content-wide">
        <div className={`
          grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center
          ${imagePosition === 'right' ? 'lg:[&>*:first-child]:order-2' : ''}
        `}>
          {/* Image placeholder */}
          <ScrollReveal>
            <div className="relative aspect-[4/3] bg-gradient-to-br from-border via-surface to-border overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse 60% 50% at 40% 40%, rgba(137, 122, 95, 0.06) 0%, transparent 60%),
                    radial-gradient(ellipse 40% 40% at 60% 70%, rgba(90, 94, 88, 0.08) 0%, transparent 50%)
                  `,
                }}
              />
              {imageLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-small text-muted tracking-widest">
                    {imageLabel}
                  </span>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Text content */}
          <StaggerReveal className="space-y-6">
            {eyebrow && (
              <span className="block text-small text-accent tracking-widest">
                {eyebrow}
              </span>
            )}
            
            <h2 className="text-heading font-display text-heading">
              {heading}
            </h2>
            
            <p className="text-body text-foreground leading-relaxed">
              {body}
            </p>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}

