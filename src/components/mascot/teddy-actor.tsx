import type { Ref } from "react";
import { Cloud, Fluff, CURL, FUR, INK, ring, type Puff } from "@/components/mascot/fur";
import { TeddyHead, TeddyPeekPaws } from "@/components/mascot/teddy-head";
import { rigOpacity, rigTransforms, type RigParams } from "@/lib/pup/rig";

/**
 * Teddy's full-body rig: a side-view body with a frontal head turned to the viewer.
 *
 * Every moving part is a <g data-part="…">. `useActorLoop` (pup-layer.tsx) writes
 * the transforms from lib/pup/rig.ts every frame; this component only draws the
 * pieces and gives them a sensible resting pose for the first paint.
 *
 * Draw order, back to front: far legs → torso (+tail) → near legs → collar → head → peek paws.
 */

const torsoPuffs: Puff[] = [...ring(112, 148, 56, 32, 13, 17), [112, 148, 44], [152, 146, 26]];
/** The seated thigh, in body space: a rounded hip low at the back of the torso. */
const haunchPuffs: Puff[] = [...ring(112, 206, 22, 17, 8, 12), [112, 206, 20], [126, 219, 13]];
const tailPom: Puff[] = [...ring(30, 92, 10, 9, 7, 9), [30, 92, 8]];

/** Resting pose for the first paint (the loop in pup-layer.tsx takes over). A static figure can pass its own. */
const REST: RigParams = { facing: 1, phase: 0, amp: 0, sit: 0, bow: 0, peek: 0, tilt: 0, t: 0 };

/**
 * One leg: a slim column of fur puffs ending in a small paw. The hip joint is the origin, and it sits
 * inside the torso, so the leg appears to grow out from under the body's lower edge.
 * `part` is the name the animation loop writes the transform to (a leg can be drawn twice).
 */
const legFluff: Puff[] = [
  [0, 0, 9],
  [0, 10, 10],
  [0, 20, 10],
  [0, 30, 10.5],
];
/** Fill-only top of a leg, drawn over the torso outline so the body line stops at each leg instead of crossing it. */
const hipPuffs: Puff[] = [[0, 16, 9.5]];
/** Always body-coloured: a darker patch would show as a dark spot on the belly. */
function Hip({ part, transform }: { part: string; transform: string }) {
  return (
    <g data-part={part} transform={transform}>
      <Cloud puffs={hipPuffs} fill={FUR} outline={false} />
    </g>
  );
}

function Leg({ part, shade, transform }: { part: string; shade: boolean; transform: string }) {
  const fill = shade ? "#e0a24f" : FUR;
  return (
    <g data-part={part} transform={transform}>
      <Fluff puffs={legFluff} fill={fill} stroke={7} />
      <ellipse cx="2" cy="44" rx="13.5" ry="8" fill={fill} stroke={INK} strokeWidth="4.5" />
      <path d="M-3 42v5M2 41v7M7 42v5" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  );
}

export function TeddyActor({
  ref,
  params,
}: {
  ref?: Ref<SVGSVGElement>;
  /** Pose for a static figure, e.g. `{ sit: 1, facing: -1 }`. */
  params?: Partial<RigParams>;
}) {
  const pose: RigParams = { ...REST, ...params };
  const rest = rigTransforms(pose);
  const restOpacity = rigOpacity(pose);
  return (
    <svg
      ref={ref}
      viewBox="0 0 300 240"
      focusable="false"
      aria-hidden="true"
      style={{ overflow: "visible", display: "block", width: "100%", height: "100%" }}
    >
      <ellipse cx="150" cy="233" rx="92" ry="7" fill={INK} opacity="0.14" />

      <g data-part="flip" transform={rest.flip}>
        <g data-part="bob" transform={rest.bob}>
          <g data-part="bodyAll" transform={rest.bodyAll} opacity={restOpacity.body}>
            {/* Legs first: the torso is drawn over their tops, so they are attached rather than stuck on. */}
            <Leg part="bf" shade transform={rest.bf} />
            <Leg part="ff" shade transform={rest.ff} />
            <g data-part="nearBack" opacity={restOpacity.nearBack}>
              <Leg part="bn" shade={false} transform={rest.bn} />
              <Leg part="fn" shade={false} transform={rest.fn} />
            </g>

            <g data-part="torso" transform={rest.torso}>
              <g data-part="tail" transform={rest.tail}>
                <path
                  d="M54 140C34 138 26 120 32 100"
                  fill="none"
                  stroke={INK}
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M54 140C34 138 26 120 32 100"
                  fill="none"
                  stroke={FUR}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <Fluff puffs={tailPom} stroke={8} />
              </g>
              <Fluff puffs={torsoPuffs} />
              <g fill="none" stroke={CURL} strokeWidth="3.2" strokeLinecap="round" opacity="0.5">
                <path d="M70 132q8-8 16 0M104 122q8-8 16 0M82 160q8 7 16 0M124 162q8 7 16 0" />
              </g>
            </g>

            <g data-part="hips" opacity={restOpacity.hips}>
              <Hip part="hipBF" transform={rest.hipBF} />
              <Hip part="hipFF" transform={rest.hipFF} />
              <Hip part="hipBN" transform={rest.hipBN} />
              <Hip part="hipFN" transform={rest.hipFN} />
            </g>

            {/* Sitting: the near legs fold in front of the body instead. */}
            <g data-part="nearFront" opacity={restOpacity.nearFront}>
              <Leg part="fnF" shade={false} transform={rest.fnF} />
            </g>
            {/* Sitting: the near hind leg becomes a rounded thigh with the foot tucked forward along the ground. */}
            <g data-part="haunch" opacity={restOpacity.haunch}>
              <Fluff puffs={haunchPuffs} stroke={8} />
              <ellipse cx="136" cy="229" rx="21" ry="8.5" fill={FUR} stroke={INK} strokeWidth="4.5" />
              <path
                d="M126 227v5M133 226v7M140 227v5"
                stroke={INK}
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            <g data-part="collar" transform={rest.collar}>
              <path
                d="M164 134Q192 160 222 138"
                fill="none"
                stroke={INK}
                strokeWidth="15"
                strokeLinecap="round"
              />
              <path
                d="M164 134Q192 160 222 138"
                fill="none"
                stroke="#a24a1a"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path d="M186 152h16l-3 12h-10z" fill="none" />
              <circle cx="194" cy="157" r="7.5" fill="#f2be6b" stroke={INK} strokeWidth="3" />
              <path
                d="M194 161c-4-3-6-5-6-7.4 0-2 1.5-3 3-3 1.2 0 2.4.7 3 1.8.6-1.1 1.8-1.8 3-1.8 1.5 0 3 1 3 3 0 2.4-2 4.4-6 7.4z"
                fill="#c2622b"
              />
            </g>
          </g>

          <g data-part="head" transform={rest.head}>
            <TeddyHead />
          </g>

          <g data-part="paws" transform={rest.paws} opacity={restOpacity.paws}>
            <TeddyPeekPaws />
          </g>
        </g>
      </g>
    </svg>
  );
}
