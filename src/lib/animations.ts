/**
 * Shared animation configuration
 *
 * Use these constants across components for consistent timing and easing.
 * Import specific values rather than the whole module for tree-shaking.
 */

// Duration presets (in seconds)
export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

// Easing curves for framer-motion
export const ease = {
  // Standard easings
  easeOut: [0.0, 0.0, 0.2, 1] as const,
  easeIn: [0.4, 0.0, 1, 1] as const,
  easeInOut: [0.4, 0.0, 0.2, 1] as const,

  // Expressive easings
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  smooth: [0.43, 0.13, 0.23, 0.96] as const,
} as const;

// GSAP-compatible easing strings
export const gsapEase = {
  easeOut: 'power2.out',
  easeIn: 'power2.in',
  easeInOut: 'power2.inOut',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
} as const;

// Common animation variants for framer-motion
export const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },
} as const;

// Stagger configuration helper
export function stagger(
  staggerChildren: number = 0.1,
  delayChildren: number = 0
) {
  return {
    animate: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

// Viewport settings for scroll-triggered animations
export const viewport = {
  once: { once: true },
  repeat: { once: false },
  partial: { once: true, amount: 0.3 },
  full: { once: true, amount: 1 },
} as const;

