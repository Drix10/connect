"use client";

/**
 * Animated Background Component
 *
 * Renders animated gradient orbs with proper accessibility and performance optimizations.
 * - Respects prefers-reduced-motion
 * - Optimized for mobile devices
 * - Proper ARIA labels
 * - GPU-accelerated animations
 *
 * @example
 * ```tsx
 * <AnimatedBackground />
 * ```
 */
export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      <div className="orb orb-1 -top-48 -left-48" />
      <div className="orb orb-2 -bottom-24 -right-24" />
      <div className="orb orb-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
