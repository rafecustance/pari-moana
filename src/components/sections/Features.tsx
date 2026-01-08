'use client';

import { FadeIn } from '@/components/animations';

const features = [
  {
    title: 'Lightning fast',
    description:
      'Optimized for speed at every level. Your users will feel the difference.',
    icon: '⚡',
  },
  {
    title: 'Developer first',
    description:
      'Built by developers, for developers. Clean APIs and excellent docs.',
    icon: '🛠',
  },
  {
    title: 'Scale effortlessly',
    description:
      'From prototype to production. Grows with your team and your ambitions.',
    icon: '📈',
  },
];

export function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Everything you need
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-muted text-center max-w-2xl mx-auto mb-16">
            Stop juggling tools. One platform to build, deploy, and iterate.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={0.2 + index * 0.1}>
              <div className="p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/5 hover:border-accent/20 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

