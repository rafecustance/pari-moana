'use client';

import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface DetailCategory {
  title: string;
  items: { label: string; value: string }[];
}

const DEFAULT_DETAILS: DetailCategory[] = [
  {
    title: 'Land & Title',
    items: [
      { label: 'Land area', value: '2.4 hectares (5.9 acres)' },
      { label: 'Title', value: 'Freehold' },
      { label: 'Zoning', value: 'Rural Residential' },
      { label: 'Council', value: 'Porirua City Council' },
    ],
  },
  {
    title: 'Residence',
    items: [
      { label: 'Floor area', value: 'Approximately 380m²' },
      { label: 'Bedrooms', value: '4' },
      { label: 'Bathrooms', value: '3' },
      { label: 'Garaging', value: 'Double internal' },
    ],
  },
  {
    title: 'Additional Buildings',
    items: [
      { label: 'Studio', value: 'Detached, 45m²' },
      { label: 'Workshop', value: 'Attached to garage' },
      { label: 'Storage', value: 'Garden shed' },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'Water', value: 'Town supply + tank backup' },
      { label: 'Power', value: 'Mains connected' },
      { label: 'Heating', value: 'Underfloor + fireplace' },
      { label: 'Internet', value: 'Fibre available' },
    ],
  },
];

interface PropertyDetailsProps {
  details?: DetailCategory[];
}

/**
 * PropertyDetails: Consolidated, scannable specifications.
 * 
 * Allows active buyers to quickly confirm suitability
 * without compromising the editorial narrative.
 */
export function PropertyDetails({ details = DEFAULT_DETAILS }: PropertyDetailsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const toggleCategory = (index: number) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(details.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const allExpanded = expandedCategories.size === details.length;

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, contentRef.current], { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.5'
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section 
      ref={sectionRef}
      className="bg-surface py-24 md:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div 
          ref={headerRef}
          className="flex items-baseline justify-between mb-12"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <h2 
            className="font-display text-heading"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
          >
            Property details
          </h2>
          
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className="text-sm text-muted hover:text-foreground transition-colors duration-300"
            style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        {/* Accordion */}
        <div 
          ref={contentRef}
          className="divide-y divide-border"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          {details.map((category, index) => {
            const isExpanded = expandedCategories.has(index);
            
            return (
              <div key={category.title} className="py-6">
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full flex items-center justify-between text-left group"
                  aria-expanded={isExpanded}
                >
                  <h3 
                    className="font-display text-heading text-lg group-hover:text-foreground transition-colors duration-300"
                  >
                    {category.title}
                  </h3>
                  
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`
                      text-muted group-hover:text-foreground
                      transition-all duration-300
                      ${isExpanded ? 'rotate-180' : 'rotate-0'}
                    `}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Expandable content */}
                <div
                  className="overflow-hidden transition-all duration-400 ease-out"
                  style={{
                    maxHeight: isExpanded ? `${category.items.length * 48 + 24}px` : '0px',
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  <dl className="pt-6 space-y-3">
                    {category.items.map((item) => (
                      <div 
                        key={item.label}
                        className="flex justify-between items-baseline"
                      >
                        <dt 
                          className="text-muted text-sm"
                          style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
                        >
                          {item.label}
                        </dt>
                        <dd 
                          className="text-foreground text-sm text-right"
                          style={{ fontFamily: 'var(--font-basis), system-ui, sans-serif' }}
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
