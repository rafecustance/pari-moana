/**
 * ANIMATION COMPONENT CONVENTIONS
 *
 * 1. All files in this directory MUST have 'use client' directive
 * 2. Prefer framer-motion for simple animations (best SSR support)
 * 3. Use GSAP for complex timelines or ScrollTrigger
 * 4. Use react-spring for physics-based / interruptible animations
 *
 * Library selection guide:
 * - Fade, slide, scale → framer-motion (FadeIn, motion.div)
 * - Complex sequences → GSAP timeline with useGSAP hook
 * - Drag, spring physics → react-spring useSpring/useDrag
 */

export { FadeIn } from './FadeIn';
export { GSAPReveal } from './GSAPReveal';
export { ScrollReveal, StaggerReveal } from './ScrollReveal';

