import { Navigation } from '@/components/layout';
import { 
  HeroFull, 
  Introduction,
  Heritage,
  Living,
  EnquiryTeaser,
  Retreat,
  Grounds,
  LocalConnection,
} from '@/components/sections';
import { assetUrl } from '@/lib/assets';

/**
 * Pari Moana Homepage
 * 
 * An editorial, imagery-first experience following a deliberate
 * emotional arc designed to capture latent demand.
 * 
 * Narrative Structure:
 * 1. Orientation + Arrival — place, mood, video journey
 * 2. Outdoor Living — emotional commitment (heart of the home)
 * 3. Retreat — privacy and separation
 * 4. Flexibility — adaptability as freedom
 * 5. Connection — human scale beyond the gate
 * 6. Close — rarity and invitation, not urgency
 */
export default function HomePage() {
  return (
    <>
      <Navigation />
      
      <main>
        {/* 1. ORIENTATION + ARRIVAL — Place, mood, video journey */}
        <HeroFull imageSrc={assetUrl('/assets/hero/hero-a8sdjc.jpg')} />
        <Introduction videoSrc={assetUrl('/assets/hero/video/hero-video-hac281d.mp4')} />
        <Heritage imageSrc="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/architecture-2-hadsk.jpg" />

        {/* 2. LIVING — Connected indoor/outdoor spaces */}
        <Living 
          images={[
            'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/living1-ahdks.jpg',
            'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/living-2-adsasd.webp',
            'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/living-5-ajdasd.webp', // placeholder for terrace
            'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/living-6-oaidas.webp', // placeholder for fireplace at dusk
          // placeholder for evening interior
          ]}
        />


        {/* 4. RETREAT — Privacy and separation */}
        <Retreat 
          primaryImage="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/retreat-1-asjda.webp"
          secondaryImage="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/retreat-2-posda.webp"
        />

        {/* 5. GROUNDS — Outdoor extension of the home */}
        <Grounds 
          slides={[
            { image: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-0.webp', alt: 'Established gardens' },
            { image: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-4.webp', alt: 'Sheltered terrace' },
            { image: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-2.webp', alt: 'Outdoor living space' },
            { image: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-1.webp', alt: 'Garden pathway' },
          ]}
        />

        {/* 6. PLACE — Property scale and local connection */}
        <LocalConnection 
          mapImageSrc={assetUrl('/assets/hero/hero-a8sdjc.jpg')}
          imageAlt="Aerial view of Pari Moana estate"
        />

        {/* 7. CLOSE — Restrained enquiry */}
        <EnquiryTeaser />
      </main>
    </>
  );
}
