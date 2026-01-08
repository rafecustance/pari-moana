'use client';

import { type ReactNode } from 'react';

interface ImagePlaceholderProps {
  aspectRatio?: 'hero' | 'landscape' | 'portrait' | 'square';
  className?: string;
  children?: ReactNode;
  label?: string;
}

const aspectRatios = {
  hero: 'aspect-[16/9] min-h-screen',
  landscape: 'aspect-[16/10]',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
};

/**
 * Elegant placeholder for future imagery.
 * Uses subtle gradients and patterns to suggest depth without distraction.
 */
export function ImagePlaceholder({
  aspectRatio = 'landscape',
  className = '',
  children,
  label,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`
        relative w-full overflow-hidden
        bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200
        ${aspectRatios[aspectRatio]}
        ${className}
      `}
    >
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(176, 137, 104, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 162, 158, 0.15) 0%, transparent 40%)
          `,
        }}
      />
      
      {/* Optional label */}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-small text-stone-400 tracking-widest">
            {label}
          </span>
        </div>
      )}
      
      {/* Content overlay */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

