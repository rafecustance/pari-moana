'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
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

interface Activity {
  id: string;
  name: string;
  description?: string;
  imageSrc?: string;
}

interface ActivitiesProps {
  /** Override default activities list */
  activities?: Activity[];
}

// -----------------------------------------------------------------------------
// Default Activities
// -----------------------------------------------------------------------------

const defaultActivities: Activity[] = [
  {
    id: 'walking',
    name: 'Walking',
    description: 'Explore coastal trails and native bush walks.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-1.webp',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    description: 'Scenic road and trail cycling through rolling countryside.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-2.webp',
  },
  {
    id: 'kayaking',
    name: 'Kayaking',
    description: 'Paddle the calm waters of Pauatahanui Inlet.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-0.webp',
  },
  {
    id: 'sailing',
    name: 'Sailing',
    description: 'Access to Wellington Harbour and beyond.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-4.webp',
  },
  {
    id: 'boating',
    name: 'Boating',
    description: 'Launch from nearby Mana Marina.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-0.webp',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    description: 'Sheltered beaches and tidal pools minutes away.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/retreat-1-asjda.webp',
  },
  {
    id: 'windsurfing',
    name: 'Windsurfing',
    description: 'Catch the breeze on the inlet or harbour.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-2.webp',
  },
  {
    id: 'jet-skiing',
    name: 'Jet skiing',
    description: 'Open water thrills on the Porirua Harbour.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-4.webp',
  },
  {
    id: 'golf',
    name: 'Golf',
    description: 'Multiple championship courses within 20 minutes.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-1.webp',
  },
  {
    id: 'horse-riding',
    name: 'Horse riding',
    description: 'Rural trails and beach rides nearby.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-0.webp',
  },
  {
    id: 'mountain-biking',
    name: 'Mountain biking',
    description: 'World-class trails at Makara Peak and beyond.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/imagery/outdoor-2.webp',
  },
];

// -----------------------------------------------------------------------------
// Activity Card Component
// -----------------------------------------------------------------------------

interface ActivityCardProps {
  activity: Activity;
}

function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div
      className="
        relative w-full max-w-md aspect-[4/5]
        bg-[#F8F8F4] 
        rounded-lg
        shadow-2xl shadow-black/25
        overflow-hidden
        animate-fade-in
      "
    >
      {/* Image */}
      {activity.imageSrc && (
        <div className="relative w-full h-3/5">
          <Image
            src={activity.imageSrc}
            alt={activity.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl text-heading leading-tight">
          {activity.name}
        </h3>
        {activity.description && (
          <p 
            className="mt-3 text-base text-foreground leading-relaxed"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            {activity.description}
          </p>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

// Card dimensions (approximate) for positioning calculations
const CARD_WIDTH = 320; // w-80 = 20rem = 320px
const CARD_HEIGHT = 400; // aspect-[4/5] with w-80
const GAP = 24;

interface CardPosition {
  x: number;
  y: number;
  horizontal: 'left' | 'right';
  vertical: 'top' | 'bottom';
}

export function Activities({ activities = defaultActivities }: ActivitiesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [cardPosition, setCardPosition] = useState<CardPosition>({ 
    x: 0, 
    y: 0, 
    horizontal: 'right', 
    vertical: 'bottom' 
  });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseLeave = useCallback(() => {
    setActiveActivity(null);
  }, []);

  const handleActivityHover = useCallback((activityId: string, e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Determine optimal horizontal position
    // If text is in right half of screen, show card to the left
    const textCenterX = rect.left + rect.width / 2;
    const horizontal: 'left' | 'right' = textCenterX > viewportWidth / 2 ? 'left' : 'right';
    
    // Calculate x position
    let x: number;
    if (horizontal === 'right') {
      x = rect.right + GAP;
      // Ensure card doesn't go off right edge
      if (x + CARD_WIDTH > viewportWidth - GAP) {
        x = viewportWidth - CARD_WIDTH - GAP;
      }
    } else {
      x = rect.left - GAP - CARD_WIDTH;
      // Ensure card doesn't go off left edge
      if (x < GAP) {
        x = GAP;
      }
    }
    
    // Vertically center the card on the text, with boundary protection
    const textCenterY = rect.top + rect.height / 2;
    let y = textCenterY - CARD_HEIGHT / 2;
    
    // Ensure card doesn't go off top or bottom edge
    if (y < GAP) {
      y = GAP;
    } else if (y + CARD_HEIGHT > viewportHeight - GAP) {
      y = viewportHeight - CARD_HEIGHT - GAP;
    }
    
    setActiveActivity(activityId);
    setCardPosition({ x, y, horizontal, vertical: 'bottom' });
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(textRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
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
        {/* Intro copy */}
        <p 
          className="text-muted text-sm uppercase tracking-widest mb-8"
          style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
        >
          A selection of activities nearby
        </p>

        <div 
          ref={textRef}
          className="relative"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Activities List */}
          <p 
            className="leading-[1.25] md:leading-[1.2]"
            style={{ 
              fontSize: 'clamp(1.875rem, 4.5vw, 3.375rem)',
              fontFamily: 'var(--font-feature), serif',
            }}
          >
            {activities.map((activity, index) => (
              <span key={activity.id}>
                <span
                  onMouseEnter={(e) => handleActivityHover(activity.id, e)}
                  className="inline cursor-pointer text-heading transition-opacity duration-300 ease-out"
                  style={{
                    opacity: activeActivity === null 
                      ? 1 
                      : activeActivity === activity.id 
                        ? 1 
                        : 0.2
                  }}
                >
                  {activity.name}
                </span>
                {index < activities.length - 1 && (
                  <span 
                    className="text-heading transition-opacity duration-300"
                    style={{
                      opacity: activeActivity === null ? 1 : 0.2
                    }}
                  >
                    ,{' '}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Activity Card - rendered outside animated container for proper fixed positioning */}
      {activeActivity && (
        <div
          className="fixed w-72 md:w-80 z-50 pointer-events-none hidden lg:block"
          style={{
            left: cardPosition.x,
            top: cardPosition.y,
          }}
        >
          {activities.find(a => a.id === activeActivity) && (
            <ActivityCard activity={activities.find(a => a.id === activeActivity)!} />
          )}
        </div>
      )}
    </section>
  );
}

