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
          <p className="text-display font-display text-stone-900 mb-8">
            Enquire privately
          </p>
          
          <a 
            href="/enquiry" 
            className="inline-block text-body text-stone-500 hover:text-stone-700 transition-colors duration-500 border-b border-stone-300 hover:border-stone-500 pb-1"
          >
            Get in touch
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

