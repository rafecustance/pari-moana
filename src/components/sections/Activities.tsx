'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import posthog from 'posthog-js';
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
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/walking.webp',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    description: 'Easy, scenic paths follow the inlet edge; ideal for casual rides and longer loops.',
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/cycling.webp',
  },
  {
    id: 'kayaking',
    name: 'Kayaking',
    description: 'Paddle calm, sheltered waters in the Pauatahanui Inlet; perfect for relaxed exploration year-round.',
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/kayaking.webp',
  },
  {
    id: 'boating_water_sports',
    name: 'Boating & Water Sports',
    description: 'Sheltered waters suit boating, water skiing, and jet skiing, with easy access to nearby launch ramps.',
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/boating.webp',
  },
  {
    id: 'sailing',
    name: 'Sailing',
    description: 'Excellent conditions for dinghy sailing across all classes, supported by a strong local sailing community including Paremata Boating Club.',
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/sailing.webp',
  },
  {
    id: 'windsurfing',
    name: 'Windsurfing',
    description: 'Steady breezes and open water at Motukaraka Point make it a favourite local windsurfing spot.',
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/windsufing.webp',
  },
  {
    id: 'golf',
    name: 'Golf',
    description: 'Two established courses nearby offer relaxed play in a rural setting.',
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/golf.webp',
  },
  {
    id: 'horse_riding',
    name: 'Horse Riding',
    description: 'Explore rolling farmland and historic trails at Battle Hill Farm Forest Park.',
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/horse-2.webp',
  },
  {
    id: 'mountain_biking',
    name: 'Mountain Biking',
    description: 'Off-road trails through native bush and farmland sit just minutes away.',
    imageSrc: 'https://assets.parimoana.co.nz/assets/activities/mtb.webp',
  },
];

// -----------------------------------------------------------------------------
// Activity Card Component
// -----------------------------------------------------------------------------

interface ActivityCardProps {
  activity: Activity;
  showTitle?: boolean;
}

function ActivityCard({ activity, showTitle = false }: ActivityCardProps) {
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
        {showTitle && (
          <h3 
            className="font-display text-xl text-heading mb-2"
            style={{ fontFamily: 'var(--font-feature), serif' }}
          >
            {activity.name}
          </h3>
        )}
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
// Mobile Modal Component
// -----------------------------------------------------------------------------

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
}

function ActivityModal({ activity, onClose }: ActivityModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-heading/60 backdrop-blur-sm" />
      
      {/* Card */}
      <div 
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <ActivityCard activity={activity} showTitle />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-lg"
          aria-label="Close"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="text-heading"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
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
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Detect mobile (below lg breakpoint)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setActiveActivity(null);
    }
  }, [isMobile]);

  const handleActivityInteraction = useCallback((activityId: string, e: React.MouseEvent<HTMLSpanElement>) => {
    // Track activity viewed event
    const activity = activities.find(a => a.id === activityId);
    if (activity && activeActivity !== activityId) {
      posthog.capture('activity_viewed', {
        activity_id: activityId,
        activity_name: activity.name,
        interaction_type: isMobile ? 'tap' : 'hover',
      });
    }

    if (isMobile) {
      // Mobile: toggle modal
      setActiveActivity((current) => current === activityId ? null : activityId);
    } else {
      // Desktop: position card near cursor
      const rect = e.currentTarget.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Determine optimal horizontal position
      const textCenterX = rect.left + rect.width / 2;
      const horizontal: 'left' | 'right' = textCenterX > viewportWidth / 2 ? 'left' : 'right';
      
      // Calculate x position
      let x: number;
      if (horizontal === 'right') {
        x = rect.right + GAP;
        if (x + CARD_WIDTH > viewportWidth - GAP) {
          x = viewportWidth - CARD_WIDTH - GAP;
        }
      } else {
        x = rect.left - GAP - CARD_WIDTH;
        if (x < GAP) {
          x = GAP;
        }
      }
      
      // Vertically center the card on the text
      const textCenterY = rect.top + rect.height / 2;
      let y = textCenterY - CARD_HEIGHT / 2;
      
      if (y < GAP) {
        y = GAP;
      } else if (y + CARD_HEIGHT > viewportHeight - GAP) {
        y = viewportHeight - CARD_HEIGHT - GAP;
      }
      
      setActiveActivity(activityId);
      setCardPosition({ x, y, horizontal, vertical: 'bottom' });
    }
  }, [isMobile, activities, activeActivity]);

  const handleCloseModal = useCallback(() => {
    setActiveActivity(null);
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

  const activeActivityData = activities.find(a => a.id === activeActivity);

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
                  onClick={(e) => isMobile && handleActivityInteraction(activity.id, e)}
                  onMouseEnter={(e) => !isMobile && handleActivityInteraction(activity.id, e)}
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

      {/* Desktop: Fixed positioned card on hover */}
      {!isMobile && activeActivityData && (
        <div
          className="fixed w-72 md:w-80 z-50 pointer-events-none"
          style={{
            left: cardPosition.x,
            top: cardPosition.y,
          }}
        >
          <ActivityCard activity={activeActivityData} />
        </div>
      )}

      {/* Mobile: Modal overlay on tap */}
      {isMobile && activeActivityData && (
        <ActivityModal 
          activity={activeActivityData} 
          onClose={handleCloseModal} 
        />
      )}
    </section>
  );
}
