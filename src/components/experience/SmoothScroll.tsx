"use client";

import * as React from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Rolagem suave global (Lenis). Desliga sozinho quando o usuário prefere
 * movimento reduzido.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
