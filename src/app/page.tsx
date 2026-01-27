import { Navigation } from '@/components/layout';
import { 
  HeroFull, 
  Introduction, 
  VideoBlock,
  Diptych,
  LivingChapter,
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

        {/* Interactive estate map with POIs */}
        <EstateMap 
          imageSrc={assetUrl('/assets/hero/hero-a8sdjc.jpg')}
          imageAlt="Aerial view of Pari Moana estate"
        />

        {/* Closing / Enquiry */}
        <EnquiryTeaser />
      </main>
    </>
  );
}
