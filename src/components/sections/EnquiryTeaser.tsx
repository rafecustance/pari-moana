'use client';

import { useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import posthog from 'posthog-js';
import { useReducedMotion } from '@/lib/use-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Registration form component that uses useSearchParams.
 * Wrapped in Suspense boundary for static generation compatibility.
 */
function RegistrationForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Generate unique event ID for Meta deduplication between Pixel and CAPI
    const eventId = crypto.randomUUID();

    // Capture form submission event (before API call)
    const utmCampaign = searchParams.get('utm_campaign');
    posthog.capture('registration_form_submitted', {
      email_domain: email.split('@')[1]?.toLowerCase(),
      utm_campaign: utmCampaign || null,
    });

    try {
      // Get PostHog distinct ID to pass to server for event correlation
      const distinctId = posthog.get_distinct_id();

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-POSTHOG-DISTINCT-ID': distinctId || '',
        },
        body: JSON.stringify({
          email,
          utmCampaign,
          eventId, // Pass to server for CAPI deduplication
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Fire Meta Pixel Lead event on successful registration
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Registration',
        }, { eventID: eventId });
      }

      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-4 px-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
        <p 
          className="text-on-image"
          style={{
            fontFamily: 'var(--font-basis), system-ui, sans-serif',
            fontSize: '0.9375rem',
          }}
        >
          Thank you for registering. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <form 
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-on-image placeholder:text-on-image/50 focus:outline-none focus:border-white/40 transition-colors duration-300 disabled:opacity-50"
          style={{ 
            fontFamily: 'var(--font-basis), system-ui, sans-serif',
            fontSize: '0.9375rem',
          }}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 font-medium text-heading bg-on-image rounded-full hover:bg-white transition-colors duration-300 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ 
            fontFamily: 'var(--font-basis), system-ui, sans-serif',
            fontSize: '0.9375rem',
          }}
        >
          {isLoading ? (
            <>
              <svg 
                className="animate-spin h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Registering...</span>
            </>
          ) : (
            'Register Interest'
          )}
        </button>
      </form>

      {error && (
        <p 
          className="text-red-300 mt-4"
          style={{
            fontSize: '0.875rem',
            fontFamily: 'var(--font-basis), system-ui, sans-serif',
          }}
        >
          {error}
        </p>
      )}
    </>
  );
}

/**
 * Loading fallback for the registration form.
 */
function RegistrationFormFallback() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <div 
        className="flex-1 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full h-12"
      />
      <div 
        className="px-6 py-3 bg-on-image/70 rounded-full h-12 w-40"
      />
    </div>
  );
}

interface EnquiryTeaserProps {
  imageSrc?: string;
}

/**
 * Full-viewport closing hero section.
 * Sunset/dusk imagery with emotional, not transactional, messaging.
 * Creates a sense of rarity and invitation.
 */
export function EnquiryTeaser({ 
  imageSrc = 'https://assets.parimoana.co.nz/assets/imagery/twilight-1.webp' 
}: EnquiryTeaserProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Subtle parallax on the image
      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Content reveal on scroll
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Image background with warm overlay */}
      <div 
        ref={imageRef}
        className="absolute inset-0 scale-110"
        style={{ top: '-10%', bottom: '-10%' }}
      >
        <Image
          src={imageSrc}
          alt="Evening light across Pari Moana"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Warm dusk gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(34, 36, 33, 0.1) 0%,
                rgba(34, 36, 33, 0.35) 50%,
                rgba(34, 36, 33, 0.65) 100%
              ),
              linear-gradient(
                to right,
                rgba(137, 122, 95, 0.08) 0%,
                transparent 50%,
                rgba(137, 122, 95, 0.08) 100%
              )
            `
          }}
        />
      </div>

      {/* Content - centered with generous breathing room */}
      <div 
        ref={contentRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-12 pb-24"
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        <div id="register" className="max-w-2xl text-center scroll-mt-24 mt-16 md:mt-24">
          {/* Eyebrow */}
          <p 
            className="text-on-image/70 mb-4 uppercase tracking-widest"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-basis), system-ui, sans-serif',
            }}
          >
            Open Homes Commencing Soon
          </p>
          
          {/* Statement */}
          <p 
            className="font-display text-on-image mb-6 max-w-3xl mx-auto"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              fontWeight: 300,
              textShadow: '0 2px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            Homes like this are seldom created and rarely offered.
          </p>
          
          {/* Supporting copy */}
          <p 
            className="text-on-image/80 mb-10 max-w-xl mx-auto"
            style={{
              fontSize: 'clamp(0.9375rem, 1.2vw, 1.0625rem)',
              lineHeight: 1.7,
              fontFamily: 'var(--font-basis), system-ui, sans-serif',
            }}
          >
            Register to receive the full information pack and priority invitations to private viewings and upcoming open homes.
          </p>

          {/* Registration form wrapped in Suspense for static generation */}
          <Suspense fallback={<RegistrationFormFallback />}>
            <RegistrationForm />
          </Suspense>
          
          {/* Privacy note */}
          <p 
            className="text-on-image/50 mt-6"
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-basis), system-ui, sans-serif',
            }}
          >
            We respect your privacy. Details shared only with the appointed agent.
          </p>
        </div>
      </div>

    </section>
  );
}
