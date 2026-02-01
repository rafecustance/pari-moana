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
    description: 'Flat coastal tracks and boardwalks wind through wetlands, wildlife reserves, and village edges.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/walking.webp',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    description: 'Easy, scenic paths follow the inlet edge; ideal for casual rides and longer loops.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/cycling.webp',
  },
  {
    id: 'kayaking',
    name: 'Kayaking',
    description: 'Paddle calm, sheltered waters in the Pauatahanui Inlet; perfect for relaxed exploration year-round.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/kayaking.webp',
  },
  {
    id: 'boating_water_sports',
    name: 'Boating & Water Sports',
    description: 'Sheltered waters suit boating, water skiing, and jet skiing, with easy access to nearby launch ramps.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/boating.webp',
  },
  {
    id: 'sailing',
    name: 'Sailing',
    description: 'Excellent conditions for dinghy sailing across all classes, supported by a strong local sailing community including Paremata Boating Club.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/sailing.webp',
  },
  {
    id: 'windsurfing',
    name: 'Windsurfing',
    description: 'Steady breezes and open water at Motukaraka Point make it a favourite local windsurfing spot.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/windsufing.webp',
  },
  {
    id: 'golf',
    name: 'Golf',
    description: 'Two established courses nearby offer relaxed play in a rural setting.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/golf.webp',
  },
  {
    id: 'horse_riding',
    name: 'Horse Riding',
    description: 'Explore rolling farmland and historic trails at Battle Hill Farm Forest Park.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/horse-2.webp',
  },
  {
    id: 'mountain_biking',
    name: 'Mountain Biking',
    description: 'Off-road trails through native bush and farmland sit just minutes away.',
    imageSrc: 'https://pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev/assets/activities/mtb.webp',
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
        relative w-full max-w-md
        bg-[#F8F8F4] 
        rounded-lg
        shadow-2xl shadow-black/25
        overflow-hidden
        animate-fade-in
      "
    >
      {/* Image */}
      {activity.imageSrc && (
        <div className="relative w-full h-48">
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
        {activity.description && (
          <p 
            className="text-base text-foreground leading-relaxed"
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
      className="bg-surface pt-0 pb-24 md:pb-40"
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
