/**
 * Pose maths for Teddy's full-body rig (see teddy-actor.tsx).
 *
 * Everything is a pure function from a handful of numbers to SVG transforms, so
 * the rig is easy to reason about: one `RigParams` in, one set of transforms out.
 *
 * Coordinates are in the rig's 300 × 240 drawing space, facing right, ground at y ≈ 230.
 */

export type RigParams = {
  /** Horizontal scale: 1 faces right, -1 faces left, values between are mid-turn. */
  facing: number;
  /** Gait cycle position in radians. */
  phase: number;
  /** 0 standing still … 1 full stride. */
  amp: number;
  /** 0 standing … 1 sitting. */
  sit: number;
  /** 0 standing … 1 play-bow: chest down, rear up, head low and forward. */
  bow: number;
  /** 0 full body … 1 only head and paws (peeking over a ledge). */
  peek: number;
  /** Extra head tilt in degrees. */
  tilt: number;
  /** Clock in milliseconds, for idle motion. */
  t: number;
};

export const HEAD_SCALE = 0.6;
/** Where each ear hangs from, inside the head (head space). Ears swing about this point so their root never shows. */
const EAR_PIVOT = { l: [48, 98], r: [192, 98] } as const;
/** Where the head sits when standing; the peek pose uses the same spot. */
export const HEAD_AT = { x: 194, y: 98 } as const;
const HEAD_SIT = { x: 172, y: 76 } as const;

type LegName = "bf" | "ff" | "bn" | "fn";

/** Hip joint for each leg when standing / sitting. */
const HIP = {
  fn: { stand: [180, 178], sit: [166, 164] },
  ff: { stand: [158, 176], sit: [152, 162] },
  bn: { stand: [104, 178], sit: [106, 222] },
  bf: { stand: [84, 176], sit: [94, 220] },
} as const;

/** Diagonal gait, as a share of the cycle: front-near moves with back-far, front-far with back-near. */
const GAIT_OFFSET: Record<LegName, number> = { fn: 0, bf: 0, ff: 0.5, bn: 0.5 };
const IS_HIND: Record<LegName, boolean> = { fn: false, ff: false, bn: true, bf: true };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const f = (n: number) => n.toFixed(2);

export type PartTransforms = Record<string, string>;
/**
 * Opacity per part. `nearBack`/`nearFront` are the near front leg drawn twice (behind the torso while
 * standing or walking so it grows out from under the body, in front of it while sitting); `haunch` is
 * the seated thigh and folded hind foot, which replace the near hind leg when he sits.
 */
export type PartOpacity = {
  body: number;
  paws: number;
  nearBack: number;
  nearFront: number;
  haunch: number;
  hips: number;
};

/**
 * Rig units of ground covered per full leg cycle. The loop advances the gait by distance travelled,
 * not by time, so the paws stay planted on the page however fast you scroll.
 */
export const STRIDE_UNITS = 140;

/** Angles are in degrees about the hip; negative = the paw is ahead of the body. */
const REACH_FRONT = -28;
const REACH_BACK = 26;
/** Share of the cycle a paw spends on the ground. */
const STANCE = 0.56;

/**
 * One leg's cycle, `u` in 0…1. On the ground the paw slides back at an even pace (so it grips the
 * page instead of skating); in the air it lifts, folds a little and swings forward ahead of the body.
 * `lift` is 0 on the ground and peaks mid-swing.
 */
export function legCycle(u: number) {
  const cycle = ((u % 1) + 1) % 1;
  if (cycle < STANCE) return { angle: lerp(REACH_FRONT, REACH_BACK, cycle / STANCE), lift: 0 };
  const k = (cycle - STANCE) / (1 - STANCE);
  const eased = k * k * (3 - 2 * k);
  const lift = Math.sin(Math.PI * k);
  return { angle: lerp(REACH_BACK, REACH_FRONT, eased) - 9 * lift, lift };
}

function leg(name: LegName, p: RigParams) {
  const stand = 1 - p.sit;
  const { angle: gaitAngle, lift } = legCycle(p.phase / (Math.PI * 2) + GAIT_OFFSET[name]);
  const swing = gaitAngle * p.amp * stand;
  const air = lift * p.amp * stand;

  const [sx, sy] = HIP[name].stand;
  const [tx, ty] = HIP[name].sit;
  const x = lerp(sx, tx, p.sit);
  // A lifted paw rises and the leg folds a little, like a knee bending.
  const y = lerp(sy, ty, p.sit) - air * 9 + (IS_HIND[name] ? 0 : 8 * p.bow);

  const hind = IS_HIND[name];
  // In a play-bow the front legs stretch forward and reach a little lower.
  const angle = hind ? lerp(swing, -82, p.sit) : swing - 28 * p.bow;
  const length = hind ? lerp(1, 0.62, p.sit) : lerp(1, 1.27, p.sit);
  const squash = 1 - air * 0.14;

  return `translate(${f(x)} ${f(y)}) rotate(${f(angle)}) scale(1 ${f(length * squash)})`;
}

export function rigTransforms(p: RigParams): PartTransforms {
  const stand = 1 - p.sit;
  const stride = Math.abs(Math.sin(p.phase));

  const bob = -stride * 5 * p.amp * stand + Math.sin(p.t / 700) * 1.1;
  const headBob = Math.sin(p.phase * 2 + 1) * 2 * p.amp;
  const hx = lerp(HEAD_AT.x, HEAD_SIT.x, p.sit) + 14 * p.bow;
  const hy = lerp(HEAD_AT.y, HEAD_SIT.y, p.sit) + headBob + 34 * p.bow;
  const headTilt = p.tilt + Math.sin(p.phase * 2) * 1.8 * p.amp + 8 * p.bow;

  const wag = Math.sin(p.t / 260) * (8 + 10 * p.amp) - 8 + p.sit * 18;

  return {
    flip: `translate(150 0) scale(${f(p.facing)} 1) translate(-150 0)`,
    bob: `translate(0 ${f(bob)})`,
    bodyAll: `translate(0 ${f(34 * p.peek)})`,
    torso: `translate(${f(32 * p.sit)} ${f(56 * p.sit)}) rotate(${f(-26 * p.sit)} 60 148) rotate(${f(15 * p.bow)} 80 176)`,
    tail: `rotate(${f(wag)} 52 134)`,
    fn: leg("fn", p),
    ff: leg("ff", p),
    bn: leg("bn", p),
    bf: leg("bf", p),
    // Hip patches: the same four joints again, drawn over the torso's outline so each leg flows into the body.
    hipBF: leg("bf", p),
    hipFF: leg("ff", p),
    hipBN: leg("bn", p),
    hipFN: leg("fn", p),
    // The in-front copy of the near front leg (used while sitting) follows the same joint.
    fnF: leg("fn", p),
    head: `translate(${f(hx)} ${f(hy)}) rotate(${f(headTilt)}) scale(${HEAD_SCALE}) translate(-120 -108)`,
    collar: `translate(${f(hx - HEAD_AT.x)} ${f(hy - HEAD_AT.y)})`,
    paws: `translate(${HEAD_AT.x} ${HEAD_AT.y}) scale(${HEAD_SCALE}) translate(-120 -108)`,
    // Ears hang from a point inside the head and sway only a few degrees behind its motion.
    earL: `rotate(${f(Math.sin(p.phase * 2 - 0.9) * 4 * p.amp)} ${EAR_PIVOT.l[0]} ${EAR_PIVOT.l[1]})`,
    earR: `rotate(${f(-Math.sin(p.phase * 2 - 0.9) * 4 * p.amp)} ${EAR_PIVOT.r[0]} ${EAR_PIVOT.r[1]})`,
  };
}

export function rigOpacity(p: RigParams): PartOpacity {
  return {
    body: clamp(1 - p.peek * 1.4),
    paws: clamp(p.peek * 1.3 - 0.1),
    nearBack: clamp(1 - p.sit),
    nearFront: clamp(p.sit),
    haunch: clamp(p.sit),
    hips: clamp(1 - p.sit * 1.6),
  };
}
