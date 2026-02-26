'use client';

import { useState } from 'react';

export function OpenHomeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-60 bg-accent/10 border-b border-accent/15">
      <div className="flex items-center justify-center px-10 py-3.5 sm:py-3">
        <a
          href="#register"
          className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-0 text-center group"
        >
          <span className="text-[15px] sm:text-base font-medium text-heading tracking-[-0.01em]">
            Final open home
          </span>
          <span className="hidden sm:inline mx-2.5 text-accent/40 select-none">·</span>
          <span className="text-[14px] sm:text-[15px] text-foreground/70">
            Sunday 1 March at 11am
          </span>
          <span
            className="mt-0.5 sm:mt-0 sm:ml-4 text-[13px] sm:text-sm text-accent border-b border-accent/40 leading-tight group-hover:border-accent transition-colors duration-300"
          >
            Register your interest
          </span>
        </a>

        <button
          onClick={(e) => {
            e.preventDefault();
            setDismissed(true);
          }}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted/50 hover:text-heading transition-colors duration-300"
          aria-label="Dismiss banner"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>
    </div>
  );
}
