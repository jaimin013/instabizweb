"use client";

import { useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";
import { TeddyActor } from "@/components/mascot/teddy-actor";
import { emitFootprint } from "@/lib/pup/prints";
import {
  easeRig,
  laneWalkY,
  LANE_PEEK_FROM_BOTTOM,
  LANE_SCALE,
  shouldPrint,
  STILL,
  travelPace,
  treadmillPace,
  type Pace,
  type Pose,
} from "@/lib/pup/motion";
import { HEAD_AT, HEAD_SCALE, rigOpacity, rigTransforms, type RigParams } from "@/lib/pup/rig";
import { actorAt, normalise, type ActorState, type Stop } from "@/lib/pup/timeline";

/*
 * One Teddy for the whole page.
 *
 * Sections declare *stops* (<PupAnchor>/<PupStop>): invisible anchors with a pose.
 * This layer owns the single dog in a fixed overlay. Every frame it asks the
 * timeline (lib/pup/timeline.ts) where he should be for the current scroll,
 * works out how he should move (walking, turning, sitting…) and writes the
 * result straight to the DOM. No React state is involved, because it changes
 * on every frame.
 */

export type PupPose = Pose;

export type StopConfig = {
  id: string;
  pose: PupPose;
  /**
   * How his body is fitted to the anchor:
   *  - "foot": he stands on the anchor's bottom edge; his size follows its width.
   *  - "peek": his head lines up with a <TeddyPeek> svg that is the anchor.
   */
  fit: "foot" | "peek";
  target: RefObject<Element | null>;
  /** The page draws its own dog at this stop; the roaming one hides while he's held there. */
  local?: boolean;
  /** Viewport fractions (of the anchor's top edge) where he arrives / leaves. Ignored for pinned stops. */
  arriveAt?: number;
  leaveAt?: number;
  /** For sticky stages: he arrives when the stage pins and leaves when it unpins. */
  pin?: { section: RefObject<HTMLElement | null>; stage: RefObject<HTMLElement | null> };
  /** Horizontal offset (px) of a world sliding past him: drives a treadmill walk cycle. */
  treadmill?: MutableRefObject<number>;
  /** Which way he faces while waiting here (1 = right). */
  facing?: 1 | -1;
  /** An extra bit of behaviour while he waits: "tilt" cocks his head, as if wondering. */
  act?: "tilt";
};

type Resolved = Stop & { cfg: StopConfig };

type Registry = { register: (cfg: StopConfig) => () => void };
const PupContext = createContext<Registry | null>(null);

/** Rig units: the actor box is 300 × 240; TeddyPeek's drawing is 240 × 192 around its head. */
const ACTOR_W = 300;
const ACTOR_H = 240;
const PEEK_W = 240;
const PEEK_H = 192;

/**
 * Next keeps the previous route mounted but hidden (display: none) after you navigate, so its stops stay
 * registered. A hidden element has no boxes at all; ignore it so Teddy only ever stands on the page you see.
 */
const isShown = (el: Element | null | undefined): el is Element =>
  !!el && el.isConnected && el.getClientRects().length > 0;

function resolve(cfg: StopConfig): Resolved | null {
  const el = cfg.target.current;
  if (!isShown(el)) return null;
  const vh = window.innerHeight;
  const sy = window.scrollY;
  const r = el.getBoundingClientRect();

  // Size and top-left of his box when held, at the current scroll.
  let s: number;
  let left: number;
  let top: number;
  if (cfg.fit === "peek") {
    s = r.width / (PEEK_W * HEAD_SCALE);
    left = r.left + (r.width * 120) / PEEK_W - HEAD_AT.x * s;
    top = r.top + (r.height * 108) / PEEK_H - HEAD_AT.y * s;
  } else {
    s = (r.width * 1.12) / ACTOR_W;
    left = r.left + r.width / 2 - (ACTOR_W / 2) * s;
    top = r.bottom - ACTOR_H * s;
  }

  if (cfg.pin) {
    // The anchor lives inside a `position: sticky` element (`stage`) held by a `section`
    // (the sticky element's containing block). Sticky has a closed form, so the whole
    // path can be computed without scrolling anywhere:
    //   stage top (viewport) = min( max(natural, stickyTop), containerBottom - scroll - height )
    // He arrives when the stage starts sticking and leaves when it is released at the bottom.
    const section = cfg.pin.section.current;
    const stage = cfg.pin.stage.current;
    if (!section || !stage || !isShown(section) || !isShown(stage)) return null;
    const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
    const containerTop = section.getBoundingClientRect().top + sy;
    const containerBottom = containerTop + section.offsetHeight;
    const stageHeight = stage.offsetHeight;
    const start = containerTop - stickyTop;
    const end = Math.max(start, containerBottom - stageHeight - stickyTop);
    // His top relative to the stage: constant, so it can be read whether or not the stage is stuck right now.
    const relTop = top - stage.getBoundingClientRect().top;
    return {
      id: cfg.id,
      cfg,
      arrive: start,
      depart: end,
      holdAt: (scroll) => ({
        x: left,
        y:
          relTop +
          Math.min(Math.max(containerTop - scroll, stickyTop), containerBottom - scroll - stageHeight),
        s,
      }),
    };
  }

  const anchorDocTop = r.top + sy;
  return {
    id: cfg.id,
    cfg,
    arrive: anchorDocTop - (cfg.arriveAt ?? 0.78) * vh,
    depart: anchorDocTop - (cfg.leaveAt ?? 0.64) * vh,
    holdAt: (scroll) => ({ x: left, y: top + sy - scroll, s }),
  };
}

/**
 * Phones (< 768px): the page is too narrow for Teddy to walk to a different spot in every section.
 * Instead, after the hero he moves to the bottom of the screen (just above the CTA bar) and keeps to
 * its corners: he peeks over the CTA bar from one corner (head and paws only, like the hero) for a whole
 * section, then, as the next section comes up, walks across to the opposite corner and peeks again. Corners alternate left, right, left… in page order.
 * Sections opt in with `data-pup-lane`. The hero and footer stops (where the page draws its own
 * Teddy) are kept; every other stop is ignored.
 */

function laneStops(): Resolved[] {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-pup-lane]")).filter(isShown);
  if (sections.length === 0) return [];
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const sy = window.scrollY;
  const w = ACTOR_W * LANE_SCALE;
  const left = -0.4 * w;
  const right = vw - w - 5;
  const peekY = vh - LANE_PEEK_FROM_BOTTOM;
  const footer = document.querySelector("footer");
  const tops = sections.map((el) => el.getBoundingClientRect().top + sy);
  const after = footer ? footer.getBoundingClientRect().top + sy : tops[tops.length - 1] + vh;

  return sections.map((el, i) => {
    const onLeft = i % 2 === 0;
    const x = onLeft ? left : right;
    // He is there from a little before his section reaches the top until the next one starts to appear.
    const arrive = tops[i] - (i === 0 ? 0.29 : 0.16) * vh;
    const depart = (tops[i + 1] ?? after) - 0.87 * vh;
    const cfg: StopConfig = {
      id: `lane-${i}`,
      pose: "peek",
      fit: "foot",
      target: { current: el },
      facing: onLeft ? 1 : -1,
    };
    return {
      id: cfg.id,
      cfg,
      arrive,
      depart,
      // Parked, he always rests on the bar's top edge. The walk's own height is applied in the loop.
      holdAt: () => ({ x, y: peekY, s: LANE_SCALE }),
    };
  });
}

/** Everything the page has declared, measured now: the stops Teddy can stand at, in scroll order. */
function buildStops(configs: Map<string, StopConfig>): Resolved[] {
  let resolved = Array.from(configs.values())
    .map(resolve)
    .filter((s): s is Resolved => s !== null);
  if (window.matchMedia("(max-width: 767px)").matches) {
    const lane = laneStops();
    if (lane.length > 0) {
      resolved = [...resolved.filter((s) => s.cfg.local && s.cfg.pose === "peek"), ...lane];
    }
  }
  return normalise(resolved);
}

/** His top edge: corner to corner on a phone he walks at his own height (see motion.ts); otherwise the timeline's. */
function heightFor(state: ActorState): number {
  const lane =
    state.kind === "travel" && state.from.id.startsWith("lane-") && state.to.id.startsWith("lane-");
  return lane ? laneWalkY(state.p, window.innerHeight) : state.at.y;
}

/** Write one frame of the rig to the SVG parts. */
function drawRig(nodes: Record<string, SVGElement>, rig: RigParams) {
  for (const [name, value] of Object.entries(rigTransforms(rig)))
    nodes[name]?.setAttribute("transform", value);
  for (const [name, value] of Object.entries(rigOpacity(rig)))
    nodes[name === "body" ? "bodyAll" : name]?.setAttribute("opacity", String(value));
}

export function PupProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const configs = useRef(new Map<string, StopConfig>());
  const dirty = useRef(true);
  const actorRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const registry = useMemo<Registry>(
    () => ({
      register: (cfg) => {
        configs.current.set(cfg.id, cfg);
        dirty.current = true;
        return () => {
          configs.current.delete(cfg.id);
          dirty.current = true;
        };
      },
    }),
    [],
  );

  useEffect(() => {
    const actor = actorRef.current;
    const svg = svgRef.current;
    if (reduceMotion || !actor || !svg) return;

    const nodes = Object.fromEntries(
      Array.from(svg.querySelectorAll<SVGElement>("[data-part]")).map((el) => [el.dataset.part!, el]),
    );
    const html = document.documentElement;

    // Anything that can move a stop re-measures on the next frame.
    const markDirty = () => {
      dirty.current = true;
    };
    const resizeObserver = new ResizeObserver(markDirty);
    resizeObserver.observe(document.body);
    window.addEventListener("resize", markDirty);
    window.addEventListener("load", markDirty);
    document.fonts?.ready.then(markDirty);
    const settle = window.setTimeout(markDirty, 1800); // after entrance animations finish

    let stops: Resolved[] = [];
    let frame = 0;
    let last = 0;
    let prev: { x: number; y: number; scroll: number; s: number } | null = null;
    const lastShift = new Map<string, number>();

    // Smoothed rig state
    const rig: RigParams = { facing: 1, phase: 0, amp: 0, sit: 0, bow: 0, peek: 1, tilt: 0, t: 0 };
    let facingTarget = 1;
    let walked = 0; // world distance since the last paw print
    let side = 1;

    /** How fast, and which way, is he really moving this frame? Also turns him to face where he is going. */
    const measure = (state: ActorState, x: number, y: number, scroll: number, dt: number): Pace => {
      const holding = state.kind === "hold" ? (state.stop as Resolved).cfg : null;
      let pace = STILL;
      if (prev && state.kind === "travel") {
        pace = travelPace(x - prev.x, y + scroll - (prev.y + prev.scroll), dt);
        walked += pace.moved;
      }
      if (holding?.treadmill) {
        const shift = holding.treadmill.current;
        const before = lastShift.get(holding.id) ?? shift;
        lastShift.set(holding.id, shift);
        pace = treadmillPace(shift, before, dt);
      } else if (holding && !pace.facing) {
        facingTarget = holding.facing ?? facingTarget;
      }
      if (pace.facing) facingTarget = pace.facing;
      return pace;
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min(60, Math.max(1, now - last)) : 16;
      last = now;

      if (dirty.current) {
        dirty.current = false;
        stops = buildStops(configs.current);
      }

      const scroll = window.scrollY;
      const state = actorAt(stops, scroll);
      if (!state) {
        actor.style.visibility = "hidden";
        return;
      }

      const { x, s } = state.at;
      const y = heightFor(state);
      const holding = state.kind === "hold" ? (state.stop as Resolved).cfg : null;

      const pace = measure(state, x, y, scroll, dt);
      prev = { x, y, scroll, s };
      easeRig(rig, { pose: holding?.pose, act: holding?.act, pace, facing: facingTarget, scale: s, now }, dt);
      drawRig(nodes, rig);

      // Place him. A stop the page draws its own Teddy at hides the roaming one while he is held there.
      actor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      const hiddenHere = holding?.local === true;
      actor.style.visibility = hiddenHere ? "hidden" : "visible";
      // Which local stop (if any) the page itself is drawing him at; CSS hides the others' copies.
      html.dataset.pupAt = hiddenHere && holding ? holding.id : "none";

      // Paw prints while he walks across the page.
      if (shouldPrint(state.kind === "travel", rig.amp, walked)) {
        walked = 0;
        side = -side;
        emitFootprint({
          x: x + (ACTOR_W / 2 + rig.facing * 26) * s,
          y: y + scroll + (ACTOR_H - 8) * s + side * 5 * s,
          angle: pace.heading + Math.PI / 2,
          doc: true,
        });
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      resizeObserver.disconnect();
      window.removeEventListener("resize", markDirty);
      window.removeEventListener("load", markDirty);
      html.removeAttribute("data-pup-at");
    };
  }, [reduceMotion]);

  return (
    <PupContext value={registry}>
      {children}
      {!reduceMotion && (
        <div className="pup-layer" aria-hidden="true">
          <div ref={actorRef} className="pup-actor">
            <TeddyActor ref={svgRef} />
          </div>
        </div>
      )}
    </PupContext>
  );
}

/** Declares a stop for an element you already have a ref to. */
export function PupStop(props: StopConfig) {
  const registry = useContext(PupContext);
  const { id, pose, fit, target, local, arriveAt, leaveAt, pin, treadmill, facing, act } = props;

  useEffect(
    () =>
      registry?.register({ id, pose, fit, target, local, arriveAt, leaveAt, pin, treadmill, facing, act }),
    [registry, id, pose, fit, target, local, arriveAt, leaveAt, pin, treadmill, facing, act],
  );
  return null;
}

/** An empty, correctly-shaped box that doubles as a stop. Size it with `className`. */
export function PupAnchor({
  className,
  style,
  ...stop
}: Omit<StopConfig, "target"> & { className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={ref} aria-hidden="true" className={className} style={style} />
      <PupStop {...stop} target={ref} />
    </>
  );
}
