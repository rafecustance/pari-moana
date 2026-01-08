import { Navigation } from '@/components/layout';
import { 
  HeroFull, 
  Introduction, 
  VideoBlock,
  ImageBlock, 
  SplitBlock,
  EnquiryTeaser 
} from '@/components/sections';

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
        <HeroFull />

        {/* Introduction */}
        <Introduction />

        {/* Video showcase */}
        <VideoBlock />

        {/* Full-bleed image */}
        <ImageBlock 
          aspectRatio="cinematic" 
          label="Living spaces" 
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
