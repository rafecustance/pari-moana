'use client';

import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-accent bg-accent/10 rounded-full">
            Now in beta
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Ship faster with
            <span className="text-accent"> Klippr</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10">
            The modern toolkit for teams who want to move fast without breaking
            things. Simple, powerful, and built for the way you work.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Get started free</Button>
            <Button variant="secondary" size="lg">
              See how it works
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

