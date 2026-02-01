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
  Activities,
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  name: "Pari Moana - 360 Paremata Road, Pauatahanui",
  description:
    "A private architectural estate above the Pauatahanui Inlet, now offered for sale. 360 Paremata Road delivers refined indoor-outdoor living, established grounds and expansive water views.",
  url: "https://www.parimoana.co.nz",
  address: {
    "@type": "PostalAddress",
    streetAddress: "360 Paremata Road",
    addressLocality: "Pauatahanui",
    addressRegion: "Wellington",
    postalCode: "5024",
    addressCountry: "NZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -41.1019,
    longitude: 174.8872,
  },
  image:
    "https://assets.parimoana.co.nz/assets/hero/hero-a8sdjc.jpg",
};

export default function HomePage() {
  return (
    <>
      <Navigation />
      
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* 1. ORIENTATION + ARRIVAL — Place, mood, video journey */}
        <HeroFull imageSrc={assetUrl('/assets/hero/hero-a8sdjc.jpg')} />
        <Introduction videoSrc={assetUrl('/assets/hero/video/hero-video-hac281d.mp4')} />
        <Heritage imageSrc="https://assets.parimoana.co.nz/assets/imagery/architecture-2-hadsk.jpg" />

        {/* 2. LIVING — Connected indoor/outdoor spaces */}
        <Living 
          images={[
            'https://assets.parimoana.co.nz/assets/imagery/living1-ahdks.jpg',
            'https://assets.parimoana.co.nz/assets/imagery/living-2-adsasd.webp',
            'https://assets.parimoana.co.nz/assets/imagery/living-5-ajdasd.webp', // placeholder for terrace
            'https://assets.parimoana.co.nz/assets/imagery/living-6-oaidas.webp', // placeholder for fireplace at dusk
          // placeholder for evening interior
          ]}
        />


        {/* 4. RETREAT — Privacy and separation */}
        <Retreat 
          primaryImage="https://assets.parimoana.co.nz/assets/imagery/retreat-1-asjda.webp"
          secondaryImage="https://assets.parimoana.co.nz/assets/imagery/retreat-2-posda.webp"
        />

        {/* 5. GROUNDS — Outdoor extension of the home */}
        <Grounds 
          slides={[
            { image: 'https://assets.parimoana.co.nz/assets/imagery/outdoor-0.webp', alt: 'Established gardens' },
            { image: 'https://assets.parimoana.co.nz/assets/imagery/outdoor-4.webp', alt: 'Sheltered terrace' },
            { image: 'https://assets.parimoana.co.nz/assets/imagery/outdoor-2.webp', alt: 'Outdoor living space' },
            { image: 'https://assets.parimoana.co.nz/assets/imagery/outdoor-1.webp', alt: 'Garden pathway' },
          ]}
        />

        {/* 6. PLACE — Property scale and local connection */}
        <LocalConnection 
          mapImageSrc={assetUrl('/assets/hero/hero-a8sdjc.jpg')}
          imageAlt="Aerial view of Pari Moana estate"
        />

        {/* 7. ACTIVITIES — What you can do */}
        <Activities />

        {/* 8. CLOSE — Restrained enquiry */}
        <EnquiryTeaser />
      </main>
    </>
  );
}
