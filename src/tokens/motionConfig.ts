import { Transition } from 'motion/react';

/**
 * Standardized Motion & Physics-Based Spring Tokens (Doc 04 §Visual design system)
 * Adheres to GEMINI.md and .agents/rules/creative-3d-animated-uiux.md
 */

// 1. Core Physics-Based Spring Configurations
export const MOTION_SPRINGS = {
  // Snappy micro-interactions: button hover, icon toggles, pill clicks
  fast: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.8
  } as Transition,

  // Standard interactive choreography: card reveals, dropdowns, modal windows
  base: {
    type: 'spring',
    stiffness: 280,
    damping: 22,
    mass: 1
  } as Transition,

  // Gentle, luxurious transitions: page entries, drawer expansions
  slow: {
    type: 'spring',
    stiffness: 180,
    damping: 24,
    mass: 1.2
  } as Transition,

  // Stiff tactile confirmation: error shakes, toggle snaps
  stiff: {
    type: 'spring',
    stiffness: 500,
    damping: 35
  } as Transition,

  // High-inertia fluid float: ambient badges, subtle drifting
  gentle: {
    type: 'spring',
    stiffness: 120,
    damping: 18
  } as Transition
} as const;

// 2. Linear / Easing Durations
export const MOTION_DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  base: 0.35,
  slow: 0.6
} as const;

// 3. Stagger Timings
export const MOTION_STAGGER = {
  fast: 0.04,
  base: 0.06,
  slow: 0.1
} as const;

/**
 * Returns an accessible transition that automatically nullifies motion
 * if user requests `prefers-reduced-motion`.
 */
export function getAccessibleTransition(
  transition: Transition,
  prefersReducedMotion: boolean = false
): Transition {
  if (prefersReducedMotion) {
    return {
      duration: 0.01,
      type: 'tween',
      ease: 'linear'
    };
  }
  return transition;
}
