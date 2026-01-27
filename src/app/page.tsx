import { Navigation } from '@/components/layout';
import { 
  HeroFull, 
  Introduction,
  Heritage,
  Living,
  EnquiryTeaser,
  Retreat,
  Flexibility,
  LocalConnection,
  PropertyDetails,
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
            'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/living-2-adsasd.webp', // placeholder for terrace
            'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/living-3-adiuad.webp', // placeholder for fireplace at dusk
            'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/living1-ahdks.jpg', // placeholder for evening interior
          ]}
        />


        {/* 4. RETREAT — Privacy and separation */}
        <Retreat 
          primaryImage="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/retreat-1-asjda.webp"
          secondaryImage="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/retreat-2-posda.webp"
        />

        {/* 5. FLEXIBILITY — Adaptability as freedom */}
        <Flexibility />

        {/* 6. CONNECTION — Human scale beyond the gate */}
        <LocalConnection />

        {/* 7. CLOSE — Property details + restrained enquiry */}
        <PropertyDetails />
        <EnquiryTeaser />
      </main>
    </>
  );
}
