'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface VideoBlockProps {
  src?: string;
  poster?: string;
}

/**
 * Contained video block with padding on sides.
 * Auto-plays muted video with scroll-triggered reveal.
 */
export function VideoBlock({
  src = 'https://cdn.prod.website-files.com/6668dadedd368b850aa41ded%2F66a871308baf37107b23653a_hillbrook-estate-experience-transcode.mp4',
  poster,
}: VideoBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(containerRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { dependencies: [prefersReducedMotion] }
  );

  return (
    <section className="bg-surface pb-24 md:pb-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-sm"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            className="w-full h-auto object-cover"
            style={{ aspectRatio: '16/9' }}
          >
            <source src={src} type="video/mp4" />
          </video>

          {/* Play/Pause button - bottom right */}
          <button
            onClick={togglePlay}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center justify-center w-12 h-12 rounded-full bg-heading/80 backdrop-blur-sm text-on-image hover:bg-heading transition-colors duration-300"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              // Pause icon
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              // Play icon
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

