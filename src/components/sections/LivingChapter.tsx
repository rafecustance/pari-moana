/**
 * LivingChapter: Simple chapter intro for the Outdoor Living section.
 * 
 * A clean text block that provides narrative context before
 * the immersive OutdoorLiving imagery experience.
 */
export function LivingChapter() {
  return (
    <section className="bg-surface py-24 md:py-32 lg:py-40">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <h2 
          className="font-display text-heading leading-[1.15] mb-6"
          style={{ 
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
          }}
        >
          Life centred outdoors
        </h2>
        <p 
          className="text-foreground leading-relaxed max-w-2xl mx-auto"
          style={{ 
            fontSize: 'clamp(1.0625rem, 1.5vw, 1.1875rem)',
          }}
        >
          Outdoor spaces form the heart of the home; suited to long lunches, quiet mornings and evenings that linger. Sheltered and private, they allow life to move easily between inside and out, with the landscape always in view.
        </p>
      </div>
    </section>
  );
}
