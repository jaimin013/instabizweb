import type { CSSProperties } from "react";
import { TeddyHead, TeddyPeekPaws } from "@/components/mascot/teddy-head";

/**
 * Teddy peeking over a ledge: head + front paws only. The head tilts around
 * the neck via `--tilt`; `data-happy` swaps the eyes for happy arcs and shows
 * his tongue. The artwork lives in teddy-head.tsx so every pose matches.
 */
export function TeddyPeek({
  className,
  style,
  tilt = 0,
  happy = false,
}: {
  className?: string;
  style?: CSSProperties;
  /** Head tilt in degrees (negative = toward his left). */
  tilt?: number;
  happy?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 240 192"
      role="img"
      aria-label="Teddy, a fluffy apricot poodle"
      focusable="false"
      className={className}
      data-happy={happy}
      style={{ overflow: "visible", "--tilt": `${tilt}deg`, ...style } as CSSProperties}
    >
      <g className="teddy-breathe">
        <g className="teddy-head">
          <TeddyHead />
        </g>
        <TeddyPeekPaws />
      </g>
    </svg>
  );
}
