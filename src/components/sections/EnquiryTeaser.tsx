'use client';

import { ScrollReveal } from '@/components/animations';

/**
 * Minimal closing section with discreet enquiry prompt.
 * Rarity and invitation, not urgency.
 */
export function EnquiryTeaser() {
  return (
    <section className="section-padding-lg">
      <div className="content-narrow text-center">
        <ScrollReveal>
          <p 
            className="text-muted text-sm uppercase tracking-widest mb-6"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            A rare offering
          </p>
          
          <p className="text-display font-display text-heading mb-10">
            Enquire privately
          </p>
          
          <a 
            href="/enquiry" 
            className="inline-block text-body text-foreground hover:text-heading transition-colors duration-500 border-b border-border hover:border-foreground pb-1"
          >
            Begin a conversation
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

