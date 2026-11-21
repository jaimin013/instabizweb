import { Cloud, FUR, FUR_SHADE, INK, Fluff, ring, type Puff } from "@/components/mascot/fur";

/**
 * Teddy's frontal head: ears, fluffy cloud with a top-knot, curls, cheeks,
 * muzzle, three eye states and the mouth.
 *
 * Drawn around the point (120, 108) in a 240-unit-wide space. Both the "peeking"
 * pose (TeddyPeek) and the full-body travelling rig (TeddyActor) place this
 * same group, so he looks identical in every pose.
 *
 * The eyes/ears/tongue have CSS classes (see motion.css) for blinking, ear
 * twitching and the happy face. Ears carry `data-part` so the rig can add
 * motion of its own on top.
 */

const headPuffs: Puff[] = [...ring(120, 112, 70, 62, 16, 20, -Math.PI / 2), [120, 112, 64]];

/**
 * Each ear is a floppy flap that hangs *behind* the head and shows only at its lower sides, its outer edge
 * just past the head's outline. The right ear mirrors the left.
 */
const earChain: Puff[] = [
  [38, 120, 15],
  [32, 136, 16],
  [34, 152, 15],
  [44, 164, 12],
  [48, 138, 14],
];
const earPuffsL = earChain;
const earPuffsR: Puff[] = earChain.map(([x, y, r]) => [240 - x, y, r]);

/** The top-knot: a wide, scalloped puff of fur sitting on the crown. */
const bun: Puff[] = [
  [101, 20, 12],
  [120, 13, 14],
  [139, 20, 12],
  [110, 30, 13],
  [130, 30, 13],
  [120, 24, 14],
];

export function TeddyHead() {
  return (
    <>
      {/* Ears and the top-knot sit behind the head, so the head's own outline overlaps their roots */}
      <g className="teddy-ear" data-part="earL">
        <Fluff puffs={earPuffsL} fill={FUR_SHADE} stroke={8} />
      </g>
      <g className="teddy-ear teddy-ear--r" data-part="earR">
        <Fluff puffs={earPuffsR} fill={FUR_SHADE} stroke={8} />
      </g>
      <Fluff puffs={bun} stroke={8} />

      {/* Head cloud: all outlines first, then all fills */}
      <Cloud puffs={headPuffs} fill={FUR} outline />
      <Cloud puffs={headPuffs} fill={FUR} outline={false} />

      {/* Cheeks + muzzle */}
      <ellipse className="teddy-cheek" cx="58" cy="134" rx="12" ry="8.5" fill="#f9a99a" opacity="0.85" />
      <ellipse className="teddy-cheek" cx="182" cy="134" rx="12" ry="8.5" fill="#f9a99a" opacity="0.85" />
      <ellipse cx="120" cy="133" rx="31" ry="24" fill="#fff1d8" />

      {/*
        Eyes: open pair + shut pair cross-fade on the blink timer; happy arcs on demand. The whole group
        is `data-part="eyes"`: EyeTracker slides it a few units toward the cursor. The sparkles only show
        when he reopens his eyes after a blush.
      */}
      <g data-part="eyes">
        <g className="teddy-eyes-open">
          <ellipse cx="95" cy="108" rx="10.5" ry="12" fill={INK} />
          <ellipse cx="145" cy="108" rx="10.5" ry="12" fill={INK} />
          <circle cx="99" cy="102.5" r="4.4" fill="#fffdf8" />
          <circle cx="91.5" cy="113" r="1.9" fill="#fffdf8" />
          <circle cx="149" cy="102.5" r="4.4" fill="#fffdf8" />
          <circle cx="141.5" cy="113" r="1.9" fill="#fffdf8" />
        </g>
        <g className="teddy-eyes-shut" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
          <path d="M84 110q11 8 22 0" />
          <path d="M134 110q11 8 22 0" />
        </g>
        <g className="teddy-eyes-happy" fill="none" stroke={INK} strokeWidth="4.6" strokeLinecap="round">
          <path d="M84 112q11-14 22 0" />
          <path d="M134 112q11-14 22 0" />
        </g>
        <g className="teddy-spark" fill="#fffdf8">
          <circle cx="100" cy="103" r="5.4" />
          <circle cx="148" cy="103" r="5.4" />
          <circle cx="92" cy="113" r="2.2" />
          <circle cx="140" cy="113" r="2.2" />
        </g>
      </g>

      {/* Nose, tongue, mouth */}
      <path
        className="teddy-tongue"
        d="M112 143q8 14 16 0z"
        fill="#f28b82"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M110 120q10-6 20 0q-1 9-10 11q-9-2-10-11z" fill={INK} />
      <path
        d="M120 131v7M120 138q-8 9-17 2M120 138q8 9 17 2"
        fill="none"
        stroke={INK}
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

/** The two front paws as drawn when he rests them on a ledge. Same space as the head. */
export function TeddyPeekPaws() {
  return (
    <>
      <g stroke={INK} strokeWidth="5" strokeLinejoin="round" fill={FUR}>
        <ellipse cx="88" cy="176" rx="22" ry="13" />
        <ellipse cx="152" cy="176" rx="22" ry="13" />
      </g>
      <g stroke={INK} strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M80 171v7M89 170v8M98 171v7" />
        <path d="M144 171v7M153 170v8M162 171v7" />
      </g>
    </>
  );
}
