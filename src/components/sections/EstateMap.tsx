'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface POI {
  id: string;
  x: number; // 0-100 percentage from left
  y: number; // 0-100 percentage from top
  title: string;
  description?: string;
  image?: string;
}

interface EstateMapProps {
  imageSrc: string;
  imageAlt?: string;
  pois?: POI[];
  aspectRatio?: 'wide' | 'cinematic' | 'standard';
  className?: string;
}

// -----------------------------------------------------------------------------
// Sample POI Data
// -----------------------------------------------------------------------------

const defaultPOIs: POI[] = [
  {
    id: 'house-stables',
    x: 52,
    y: 48,
    title: 'House & Stables',
    description: 'The heart of Hillbrook Estate.',
    image: '/hero-a8sdjc.jpg',
  },
  {
    id: 'north-beach',
    x: 18,
    y: 68,
    title: 'North Beach',
    description: 'A secluded sandy cove with calm waters.',
  },
  {
    id: 'south-beach',
    x: 38,
    y: 75,
    title: 'South Beach',
    description: 'Rocky outcrops and crystal-clear pools.',
  },
  {
    id: 'lookout',
    x: 73,
    y: 18,
    title: 'Ocean Lookout',
    description: 'Panoramic views across the bay.',
  },
  {
    id: 'forest-walk',
    x: 85,
    y: 55,
    title: 'Forest Walk',
    description: 'Native bush trails through ancient pohutukawa.',
  },
  {
    id: 'vineyard',
    x: 78,
    y: 38,
    title: 'Vineyard',
    description: 'Estate-grown grapes for private reserve wines.',
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

// Calculate card position based on POI location
// Card opens away from the nearest edge for optimal visibility
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
  const cardRef = useRef<HTMLDivElement>(null);
  const position = getCardPosition(poi);
  
  // Spacing between POI marker and card (in pixels for GSAP compatibility)
  const gapPx = 16;

  useEffect(() => {
    // Animate in from the appropriate direction
    if (cardRef.current) {
      const xDirection = position.horizontal === 'right' ? -1 : 1;
      const yDirection = position.vertical === 'bottom' ? -1 : 1;
      
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: xDirection * 10, y: yDirection * 10, scale: 0.98 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [position.horizontal, position.vertical]);

  // Calculate positioning styles
  // We use left/right and top/bottom to avoid transform conflicts with GSAP
  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    if (position.horizontal === 'right') {
      // Card opens to the right of POI
      styles.left = `calc(${poi.x}% + ${gapPx}px)`;
    } else {
      // Card opens to the left of POI
      styles.right = `calc(${100 - poi.x}% + ${gapPx}px)`;
    }
    
    if (position.vertical === 'bottom') {
      // Card opens below the POI
      styles.top = `calc(${poi.y}% + ${gapPx}px)`;
    } else {
      // Card opens above the POI
      styles.bottom = `calc(${100 - poi.y}% + ${gapPx}px)`;
    }
    
    return styles;
  };

  return (
    <div
      ref={cardRef}
      className="
        absolute z-10
        w-80 max-w-[calc(100vw-2rem)]
        bg-[#F8F8F4] 
        rounded-lg
        shadow-2xl shadow-black/25
        overflow-hidden
      "
      style={getPositionStyles()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex">
        {/* Image */}
        {poi.image && (
          <div className="w-32 flex-shrink-0">
            <div className="aspect-square bg-gradient-to-br from-border via-surface to-border">
              <img
                src={poi.image}
                alt={poi.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4">
          <h3 className="font-feature text-lg italic text-heading leading-tight">
            {poi.title}
          </h3>
          {poi.description && (
            <p className="mt-1.5 text-sm text-foreground leading-relaxed">
              {poi.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Authoring Overlay Component
// -----------------------------------------------------------------------------

interface AuthoringOverlayProps {
  cursorPosition: { x: number; y: number } | null;
}

function AuthoringOverlay({ cursorPosition }: AuthoringOverlayProps) {
  return (
    <>
      {/* Cursor position readout */}
      <div
        className="
          fixed bottom-4 left-4 z-50
          px-3 py-2
          bg-black/80 backdrop-blur-sm
          rounded-md
          border border-dashed border-white/30
          font-mono text-xs text-white
        "
      >
        <div className="text-white/50 mb-1">Authoring Mode</div>
        {cursorPosition ? (
          <div>
            x: {cursorPosition.x.toFixed(1)}% &nbsp; y: {cursorPosition.y.toFixed(1)}%
          </div>
        ) : (
          <div className="text-white/50">Hover over image...</div>
        )}
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// Main EstateMap Component
// -----------------------------------------------------------------------------

const aspectRatios = {
  wide: 'aspect-[21/9]',
  cinematic: 'aspect-[16/9]',
  standard: 'aspect-[4/3]',
};

export function EstateMap({
  imageSrc,
  imageAlt = 'Estate aerial view',
  pois = defaultPOIs,
  aspectRatio = 'cinematic',
  className = '',
}: EstateMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const searchParams = useSearchParams();

  // State
  const [activePOI, setActivePOI] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);

  // Authoring mode from query param
  const isAuthoringMode = searchParams.get('author') === 'true';

  // Scroll-triggered reveal animation
  useGSAP(
    () => {
      if (!containerRef.current || prefersReducedMotion) {
        if (containerRef.current) {
          gsap.set(containerRef.current, { opacity: 1 });
        }
        return;
      }

      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  // Calculate percentage position from mouse event
  const getPercentagePosition = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageContainerRef.current) return null;

      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      return { x, y };
    },
    []
  );

  // Handle mouse move for authoring mode
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isAuthoringMode) return;
      const pos = getPercentagePosition(e);
      if (pos) setCursorPosition(pos);
    },
    [isAuthoringMode, getPercentagePosition]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isAuthoringMode) {
      setCursorPosition(null);
    }
  }, [isAuthoringMode]);

  // Handle click on image (for authoring or closing POI)
  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isAuthoringMode) {
        const pos = getPercentagePosition(e);
        if (pos) {
          console.log('POI Coordinates:', {
            x: Math.round(pos.x * 10) / 10,
            y: Math.round(pos.y * 10) / 10,
          });
        }
      } else {
        // Close active POI if clicking outside
        setActivePOI(null);
      }
    },
    [isAuthoringMode, getPercentagePosition]
  );

  // Handle POI click
  const handlePOIClick = useCallback((poiId: string) => {
    setActivePOI((current) => (current === poiId ? null : poiId));
  }, []);

  // Get active POI data
  const activePOIData = pois.find((p) => p.id === activePOI);

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ opacity: prefersReducedMotion ? 1 : 0 }}
    >
      {/* Image container with locked aspect ratio */}
      <div
        ref={imageContainerRef}
        className={`
          relative w-full overflow-hidden
          ${aspectRatios[aspectRatio]}
          ${isAuthoringMode ? 'cursor-crosshair' : ''}
        `}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleImageClick}
      >
        {/* Background image */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
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
        {activePOIData && (
          <POIDetailCard poi={activePOIData} />
        )}
      </div>

      {/* "See all activities" link */}
      <div className="absolute bottom-6 left-6 z-10">
        <a
          href="#activities"
          className="
            text-on-image text-sm font-medium
            border-b border-on-image/60
            hover:border-on-image
            transition-colors duration-200
          "
        >
          See all activities
        </a>
      </div>

      {/* Authoring mode overlay */}
      {isAuthoringMode && <AuthoringOverlay cursorPosition={cursorPosition} />}
    </section>
  );
}
