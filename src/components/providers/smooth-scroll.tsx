"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Lenis gives the site its weighted, buttery scroll. Users who ask
 * for reduced motion keep the browser's native scrolling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
