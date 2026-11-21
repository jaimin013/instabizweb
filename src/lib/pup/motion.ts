import { STRIDE_UNITS, type RigParams } from "./rig.ts";
import { clamp, smoothstep } from "./timeline.ts";

/**
 * The rules for how Teddy moves, as plain functions of numbers (no DOM, no React), so they can be tested.
 * `pup-layer.tsx` measures the page, calls these, and writes the result to the DOM.
 */

export type Pose = "walk" | "sit" | "bow" | "peek";

/** How he is moving this frame. `facing` is the way he should turn, or null to keep his current direction. */
export type Pace = {
  /** Speed in "px per 60 fps frame" units: drives how far the legs swing. */
  walkSpeed: number;
  /** Screen px covered this frame: the gait advances by this, not by time, so paws never skate. */
  stepPx: number;
  /** Direction of travel in radians (for paw-print angle). */
  heading: number;
  /** World distance covered while travelling, for the paw-print spacing. */
  moved: number;
  facing: 1 | -1 | null;
};

export const STILL: Pace = { walkSpeed: 0, stepPx: 0, heading: 0, moved: 0, facing: null };

const FRAME_MS = 16.7;

/** Walking from one stop to the next: pace from how far he moved on screen and in the page. */
export function travelPace(dx: number, dyWorld: number, dt: number): Pace {
  const distance = Math.hypot(dx, dyWorld);
  return {
    walkSpeed: (distance * FRAME_MS) / dt,
    stepPx: distance,
    heading: Math.atan2(dyWorld, dx),
    moved: distance,
    facing: Math.abs(dx) > 0.4 ? (dx > 0 ? 1 : -1) : null,
  };
}

/** Treading on the spot while a world slides past him (the pinned hall of doors). */
export function treadmillPace(shift: number, before: number, dt: number): Pace {
  const delta = ((shift - before) * FRAME_MS) / dt;
  const walkSpeed = Math.abs(delta);
  return {
    walkSpeed,
    stepPx: Math.abs(shift - before),
    heading: 0,
    moved: 0,
    facing: walkSpeed > 0.6 ? (delta > 0 ? 1 : -1) : null,
  };
}

export type RigGoal = {
  /** The pose he is held in at a stop, or undefined while travelling. */
  pose?: Pose;
  /** An extra bit of behaviour while he waits: "tilt" cocks his head. */
  act?: "tilt";
  pace: Pace;
  /** Which way he should be facing (1 = right). */
  facing: number;
  /** His on-screen scale (px per drawing unit). */
  scale: number;
  /** Clock in ms, for idle motion. */
  now: number;
};

/**
 * Moves `rig` a step towards `goal`. Each channel eases with its own time constant (ms), so he leans into
 * a walk, turns quickly, settles into a sit or bow more slowly and cocks his head last. Mutates `rig`.
 */
export function easeRig(rig: RigParams, goal: RigGoal, dt: number): void {
  const ease = (tau: number) => 1 - Math.exp(-dt / tau);
  rig.amp += (clamp(goal.pace.walkSpeed / 7) - rig.amp) * ease(110);
  // One full leg cycle per STRIDE_UNITS of ground (in his own drawing units).
  if (rig.amp > 0.03) rig.phase += (goal.pace.stepPx / goal.scale / STRIDE_UNITS) * Math.PI * 2;
  rig.facing += (goal.facing - rig.facing) * ease(70);
  rig.sit += ((goal.pose === "sit" ? 1 : 0) - rig.sit) * ease(150);
  rig.bow += ((goal.pose === "bow" ? 1 : 0) - rig.bow) * ease(170);
  rig.peek += ((goal.pose === "peek" ? 1 : 0) - rig.peek) * ease(110);
  const tiltTarget = goal.act === "tilt" ? 11 : Math.sin(goal.now / 2300) * 3 * (1 - rig.amp);
  rig.tilt += (tiltTarget - rig.tilt) * ease(220);
  rig.t = goal.now;
}

/** World distance between paw prints, in px. */
const PRINT_EVERY = 46;

/** Leave a paw print now? Only while really walking across the page, and not too often. */
export const shouldPrint = (travelling: boolean, amp: number, walked: number) =>
  travelling && amp > 0.35 && walked > PRINT_EVERY;

// ── Phone lane ─────────────────────────────────────────────────────────────

/** On phones he works along the bottom of the screen, 60 % size, tucked behind the CTA bar. */
export const LANE_SCALE = 0.6;
/** Gap between his box top and the screen bottom while peeking over the bar (paws on its top edge)... */
export const LANE_PEEK_FROM_BOTTOM = 161;
/** ...and while walking, a little higher so his feet land on the bar's top line. */
export const LANE_WALK_FROM_BOTTOM = 221;
/** Share of a corner-to-corner walk spent dropping onto / rising off the bar. */
const LANE_EDGE = 0.15;

/** His box top (px) while walking between two corners, `p` = 0…1 along the walk. */
export function laneWalkY(p: number, viewportHeight: number): number {
  const peekY = viewportHeight - LANE_PEEK_FROM_BOTTOM;
  const walkY = viewportHeight - LANE_WALK_FROM_BOTTOM;
  const edge = Math.min(smoothstep(clamp(p / LANE_EDGE)), smoothstep(clamp((1 - p) / LANE_EDGE)));
  return peekY + (walkY - peekY) * edge;
}
