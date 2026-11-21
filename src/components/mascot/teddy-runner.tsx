import { Fluff, FUR, FUR_SHADE, INK, ring, type Puff } from "@/components/mascot/fur";

/**
 * Teddy in side view, running to the right. Used by the page curtain.
 * Legs, body, tail and ear are plain SVG groups that curtain.css animates, so it
 * needs no JavaScript. Hips sit at x = 100 and x = 180, y = 192 (see `transform-origin`).
 */

const body: Puff[] = [...ring(134, 162, 48, 30, 11, 16), [134, 162, 40]];
const head: Puff[] = [...ring(218, 112, 40, 35, 12, 17, -Math.PI / 2), [218, 112, 38]];
const knot: Puff[] = [
  [218, 72, 15],
  [204, 82, 11],
  [232, 82, 11],
];
const ear: Puff[] = ring(190, 128, 12, 24, 7, 11);
const tail: Puff[] = [...ring(76, 108, 9, 8, 7, 10), [76, 108, 9]];

const legPuffs: Puff[] = [
  [0, -2, 11],
  [0, 9, 11],
  [0, 20, 11],
  [0, 30, 12],
];

function Leg({ name, x, shade }: { name: string; x: number; shade: boolean }) {
  const fill = shade ? FUR_SHADE : FUR;
  return (
    <g className={`tp-runner__leg tp-runner__leg--${name}`} style={{ transformOrigin: `${x}px 192px` }}>
      <g transform={`translate(${x} 192)`}>
        <Fluff puffs={legPuffs} fill={fill} stroke={6} />
        <ellipse cx="3" cy="31" rx="15" ry="9" fill={fill} stroke={INK} strokeWidth="4" />
        <path d="M-2 29v5M4 28v7M10 29v5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

export function TeddyRunner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 240"
      className={className ? `tp-runner ${className}` : "tp-runner"}
      aria-hidden="true"
      focusable="false"
      style={{ overflow: "visible" }}
    >
      <ellipse cx="150" cy="232" rx="86" ry="7" fill={INK} opacity="0.12" className="tp-runner__shadow" />
      <g className="tp-runner__body">
        <Leg name="bf" x={104} shade />
        <Leg name="ff" x={172} shade />
        <g className="tp-runner__tail" style={{ transformOrigin: "98px 150px" }}>
          <path
            d="M100 152C84 148 78 130 78 112"
            fill="none"
            stroke={INK}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M100 152C84 148 78 130 78 112"
            fill="none"
            stroke={FUR}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Fluff puffs={tail} stroke={6} />
        </g>
        <Fluff puffs={body} stroke={8} />
        <Leg name="bn" x={98} shade={false} />
        <Leg name="fn" x={166} shade={false} />
        <g className="tp-runner__ear" style={{ transformOrigin: "192px 106px" }}>
          <Fluff puffs={ear} fill={FUR_SHADE} stroke={6} />
        </g>
        <Fluff puffs={knot} stroke={7} />
        <Fluff puffs={head} stroke={8} />
        <ellipse cx="218" cy="128" rx="20" ry="15" fill="#fff1d8" />
        <ellipse cx="190" cy="130" rx="8" ry="6" fill="#f9a99a" opacity="0.85" />
        <ellipse cx="246" cy="130" rx="8" ry="6" fill="#f9a99a" opacity="0.85" />
        <path
          d="M195 107q8-11 16 0M225 107q8-11 16 0"
          fill="none"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M210 117q8-5 16 0q-1 8-8 9q-7-1-8-9z" fill={INK} />
        <path d="M212 134q6 8 12 0z" fill="#f28b82" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        {/* Collar and heart tag, over the chin */}
        <path d="M194 158Q218 176 242 158" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" />
        <path
          d="M194 158Q218 176 242 158"
          fill="none"
          stroke="#a24a1a"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <circle cx="218" cy="171" r="6.5" fill={FUR} stroke={INK} strokeWidth="2.6" />
        <path
          d="M218 175c-3-2.2-4.4-3.6-4.4-5.2 0-1.2.9-2 2-2 .9 0 1.8.5 2.4 1.3.6-.8 1.5-1.3 2.4-1.3 1.1 0 2 .8 2 2 0 1.6-1.400 3-4.400 5.200z"
          fill="#c2622b"
        />
      </g>
    </svg>
  );
}
