/**
 * Shared pieces for drawing Teddy's fluffy poodle fur.
 *
 * A fluffy shape is a set of overlapping circles ("puffs") drawn twice:
 * first with a thick ink stroke, then fill-only on top. The fill hides the
 * strokes inside the cloud, leaving one scalloped silhouette.
 */

export const FUR = "#f2be6b";
export const FUR_SHADE = "#e0a24f";
export const CURL = "#b8742a";
export const INK = "#2a170e";

/** [cx, cy, r] */
export type Puff = readonly [cx: number, cy: number, r: number];

/** Evenly spaced puffs around an ellipse. */
export function ring(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  count: number,
  r: number,
  from = 0,
): Puff[] {
  return Array.from({ length: count }, (_, i) => {
    const a = from + (i / count) * Math.PI * 2;
    return [Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry), r] as const;
  });
}

/** One pass of a cloud: call once with `outline` and once without, in that order. */
export function Cloud({
  puffs,
  fill = FUR,
  outline,
  stroke = 9,
}: {
  puffs: readonly Puff[];
  fill?: string;
  outline: boolean;
  stroke?: number;
}) {
  return (
    <>
      {puffs.map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          stroke={outline ? INK : "none"}
          strokeWidth={outline ? stroke : 0}
        />
      ))}
    </>
  );
}

/** A fluffy shape drawn in both passes. */
export function Fluff({
  puffs,
  fill = FUR,
  stroke = 9,
}: {
  puffs: readonly Puff[];
  fill?: string;
  stroke?: number;
}) {
  return (
    <>
      <Cloud puffs={puffs} fill={fill} stroke={stroke} outline />
      <Cloud puffs={puffs} fill={fill} stroke={stroke} outline={false} />
    </>
  );
}
