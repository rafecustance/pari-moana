import { Navigation } from '@/components/layout';
import { 
  HeroFull, 
  Introduction, 
  VideoBlock,
  Diptych,
  LivingChapter,
  Architecture,
  ImageBlock, 
  SplitBlock,
  EnquiryTeaser,
  EstateMap 
} from '@/components/sections';
import { assetUrl } from '@/lib/assets';

/**
 * Pari Moana Homepage
 * 
 * An editorial, imagery-first experience.
 * Scroll-driven storytelling with minimal text.
 */
export default function HomePage() {
  return (
    <>
      <Navigation />
      
      <main>
        {/* Full-viewport hero */}
        <HeroFull imageSrc={assetUrl('/assets/hero/hero-a8sdjc.jpg')} />

        {/* Introduction */}
        <Introduction />

        {/* Video showcase */}
        <VideoBlock src={assetUrl('/assets/hero/video/hero-video-hac281d.mp4')} />

        {/* Arrival - two-phase sticky scroll */}
        <Diptych
          imageSrc={assetUrl('/assets/imagery/arrival-vertical-jau8w.jpeg')}
          imageAlt="Tree-lined driveway approaching the estate"
          phase2ImageSrc="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/threshold.jpg"
          phase2ImageAlt="Threshold view of the residence"
        />

        {/* Living, Not Rooms - pinned chapter */}
        <LivingChapter 
          images={[
            assetUrl('/assets/imagery/living1-ahdks.jpg'),
            assetUrl('/assets/imagery/living2-hsgdjs.jpg'),
            assetUrl('/assets/imagery/living3-aowidk.jpg'),
          ]}
        />

        {/* Architecture section - editorial two-column layout */}
        <Architecture
          headingOption="A"
          primaryImage="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/architecture-1-qpasdhdjpg.jpg"
          secondaryImage="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/architecture-2-hadsk.jpg"
          supportingImage="https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/architecture-0-bahdyw.jpg"
        />

        {/* Full-bleed image */}
        <ImageBlock 
          aspectRatio="cinematic" 
          label="Living spaces" 
        />

        {/* Interactive estate map with POIs */}
        <EstateMap 
          imageSrc={assetUrl('/assets/hero/hero-a8sdjc.jpg')}
          imageAlt="Aerial view of Pari Moana estate"
        />

        {/* Split block: Light */}
        <SplitBlock
          eyebrow="Light"
          heading="Designed for the sun"
          body="Floor-to-ceiling glass captures the changing quality of coastal light, from the soft glow of dawn to the golden warmth of evening."
          imagePosition="left"
          imageLabel="Morning light"
        />

        {/* Full-bleed image */}
        <ImageBlock 
          aspectRatio="wide" 
          label="Exterior view" 
        />

        {/* Split block: Space */}
        <SplitBlock
          eyebrow="Space"
          heading="Rooms that breathe"
          body="Open floor plans flow seamlessly from interior to exterior, creating spaces that feel both intimate and boundless."
          imagePosition="right"
          imageLabel="Indoor-outdoor flow"
        />

        {/* Full-bleed image */}
        <ImageBlock 
          aspectRatio="cinematic" 
          label="Detail" 
        />

        {/* Split block: Tranquility */}
        <SplitBlock
          eyebrow="Tranquility"
          heading="A retreat from the world"
          body="Set apart from the everyday, this is a place where time moves differently. Where the rhythm of the tides becomes your own."
          imagePosition="left"
          imageLabel="Private beach"
        />

        {/* Closing / Enquiry */}
        <EnquiryTeaser />
      </main>
    </>
  );
}
