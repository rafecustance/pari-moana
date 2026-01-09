'use client';

import { ScrollReveal } from '@/components/animations';

/**
 * Minimal closing section with discreet enquiry prompt.
 * Large breathing room, understated presence.
 */
export function EnquiryTeaser() {
  return (
    <section className="section-padding-lg">
      <div className="content-narrow text-center">
        <ScrollReveal>
          <p className="text-display font-display text-heading mb-8">
            Enquire privately
          </p>
          
          <a 
            href="/enquiry" 
            className="inline-block text-body text-foreground hover:text-heading transition-colors duration-500 border-b border-border hover:border-foreground pb-1"
          >
            Get in touch
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

