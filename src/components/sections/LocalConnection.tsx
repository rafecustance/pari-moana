'use client';

import { useRef, useState, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface POI {
  id: string;
  x: number;
  y: number;
  title: string;
  description?: string;
}

interface LocalConnectionProps {
  /** Static image (used if no mapImageSrc provided) */
  imageSrc?: string;
  imageAlt?: string;
  /** Interactive map image */
  mapImageSrc?: string;
  /** Points of interest for the map */
  pois?: POI[];
}

// -----------------------------------------------------------------------------
// Default POIs - Estate features and local connections
// -----------------------------------------------------------------------------

const defaultPOIs: POI[] = [
  {
    id: 'main-residence',
    x: 45,
    y: 42,
    title: 'Main Residence',
    description: '380m² of considered living space.',
  },
  {
    id: 'gardens',
    x: 58,
    y: 55,
    title: 'Established Gardens',
    description: 'Mature plantings and sheltered outdoor rooms.',
  },
  {
    id: 'studio',
    x: 35,
    y: 60,
    title: 'Detached Studio',
    description: 'A flexible 45m² space at the garden edge.',
  },
  {
    id: 'inlet-access',
    x: 22,
    y: 75,
    title: 'Inlet Access',
    description: 'Walking distance to the water.',
  },
  {
    id: 'village',
    x: 78,
    y: 28,
    title: 'Pauatahanui Village',
    description: 'Morning coffee, weekend markets, familiar faces.',
  },
];

// -----------------------------------------------------------------------------
// POI Marker Component
// -----------------------------------------------------------------------------

interface POIMarkerProps {
  poi: POI;
  isActive: boolean;
  isHidden: boolean;
  onClick: () => void;
}

function POIMarker({ poi, isActive, isHidden, onClick }: POIMarkerProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        absolute z-20
        w-7 h-7 -ml-3.5 -mt-3.5
        flex items-center justify-center
        rounded-full
        bg-white/90 backdrop-blur-sm
        border border-white/50
        transition-all duration-300 ease-out
        focus:outline-none
        ${isActive 
          ? 'bg-white shadow-none' 
          : 'shadow-lg shadow-black/20 hover:scale-125 hover:bg-white'
        }
        ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
      style={{
        left: `${poi.x}%`,
        top: `${poi.y}%`,
      }}
      aria-label={isActive ? `Close ${poi.title}` : `View ${poi.title}`}
      aria-hidden={isHidden}
      tabIndex={isHidden ? -1 : 0}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={`
          text-heading
          transition-transform duration-300 ease-out
          ${isActive ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <path
          d="M6 1V11M1 6H11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

// -----------------------------------------------------------------------------
// POI Detail Card Component
// -----------------------------------------------------------------------------

interface POIDetailCardProps {
  poi: POI;
}

function getCardPosition(poi: POI): {
  horizontal: 'left' | 'right';
  vertical: 'top' | 'bottom';
} {
  return {
    horizontal: poi.x > 50 ? 'left' : 'right',
    vertical: poi.y > 50 ? 'top' : 'bottom',
  };
}

function POIDetailCard({ poi }: POIDetailCardProps) {
  const position = getCardPosition(poi);
  const gapPx = 16;

  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    if (position.horizontal === 'right') {
      styles.left = `calc(${poi.x}% + ${gapPx}px)`;
    } else {
      styles.right = `calc(${100 - poi.x}% + ${gapPx}px)`;
    }
    
    if (position.vertical === 'bottom') {
      styles.top = `calc(${poi.y}% + ${gapPx}px)`;
    } else {
      styles.bottom = `calc(${100 - poi.y}% + ${gapPx}px)`;
    }
    
    return styles;
  };

  return (
    <div
      className="
        absolute z-10
        w-72 max-w-[calc(100vw-2rem)]
        bg-[#F8F8F4] 
        rounded-lg
        shadow-2xl shadow-black/25
        overflow-hidden
        animate-fade-in
      "
      style={getPositionStyles()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        <h3 className="font-display text-lg italic text-heading leading-tight">
          {poi.title}
        </h3>
        {poi.description && (
          <p 
            className="mt-1.5 text-sm text-foreground leading-relaxed"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            {poi.description}
          </p>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Interactive Map Component
// -----------------------------------------------------------------------------

interface InteractiveMapProps {
  imageSrc: string;
  imageAlt: string;
  pois: POI[];
  prefersReducedMotion: boolean;
}

function InteractiveMap({ imageSrc, imageAlt, pois, prefersReducedMotion }: InteractiveMapProps) {
  const [activePOI, setActivePOI] = useState<string | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handlePOIClick = useCallback((poiId: string) => {
    setActivePOI((current) => (current === poiId ? null : poiId));
  }, []);

  const handleImageClick = useCallback(() => {
    setActivePOI(null);
  }, []);

  const activePOIData = pois.find((p) => p.id === activePOI);

  return (
    <div
      ref={imageContainerRef}
      className="relative w-full aspect-[16/9] overflow-hidden cursor-pointer"
      onClick={handleImageClick}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* POI Markers */}
      {pois.map((poi) => (
        <POIMarker
          key={poi.id}
          poi={poi}
          isActive={activePOI === poi.id}
          isHidden={activePOI !== null && activePOI !== poi.id}
          onClick={() => handlePOIClick(poi.id)}
        />
      ))}

      {/* Active POI Detail Card */}
      {activePOIData && <POIDetailCard poi={activePOIData} />}

      {/* Explore prompt */}
      {!activePOI && !prefersReducedMotion && (
        <div className="absolute bottom-6 left-6 z-10">
          <span className="text-on-image text-sm tracking-wide opacity-80">
            Tap to explore
          </span>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

function LocalConnectionInner({
  imageSrc,
  imageAlt = 'Pauatahanui village and inlet',
  mapImageSrc,
  pois = defaultPOIs,
}: LocalConnectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Use map if provided, otherwise fall back to static image
  const hasMap = Boolean(mapImageSrc);
  const displayImageSrc = mapImageSrc || imageSrc;

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([textRef.current, mapRef.current, detailsRef.current], { 
          opacity: 1, 
          y: 0 
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      tl.fromTo(
        mapRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.7'
      );

      tl.fromTo(
        detailsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section 
      ref={sectionRef}
      className="bg-surface py-24 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Intro copy - bridges property and place */}
        <div 
          ref={textRef}
          className="max-w-2xl mb-12 md:mb-16"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <h2 
            className="font-display font-light text-heading mb-6"
            style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              lineHeight: 1.15,
            }}
          >
            A private world - perfectly connected.
          </h2>
          
          <p 
            className="text-foreground text-base md:text-lg leading-relaxed mb-4"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            And while Pari Moana feels a world away, Pāuatahanui Village is right on its doorstep; morning coffee, inlet walks, a boutique movie house and a friendly local community, with a wide range of outdoor activities close by.
          </p>
          <p 
            className="text-foreground text-base md:text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            When you do need to venture further, Wellington City, the Hutt Valley and the Kāpiti Coast are all within easy reach.
          </p>
        </div>

        {/* Property Image (POI functionality disabled for now) */}
        <div 
          ref={mapRef}
          className="mb-12 md:mb-16"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            {displayImageSrc ? (
              <Image
                src={displayImageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-surface to-slate-50/30 flex items-center justify-center">
                <span className="text-small text-muted tracking-widest">
                  {imageAlt}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details grid - property attributes + proximity */}
        <div 
          ref={detailsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          {[
            { label: 'Village', value: '2 min' },
            { label: 'Porirua', value: '10 min' },
            { label: 'Wellington', value: '25 min' },
            { label: 'Airport', value: '30 min' },
          ].map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <p 
                className="text-muted text-sm uppercase tracking-widest mb-1"
                style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
              >
                {item.label}
              </p>
              <p className="font-display text-heading text-xl md:text-2xl">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Wrap with Suspense for useSearchParams compatibility
export function LocalConnection(props: LocalConnectionProps) {
  return (
    <Suspense fallback={<LocalConnectionInner {...props} />}>
      <LocalConnectionInner {...props} />
    </Suspense>
  );
}
