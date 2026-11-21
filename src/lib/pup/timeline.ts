/**
 * Where is Teddy for a given scroll position?
 *
 * The page has a series of "stops": places where he waits (peeking in the hero,
 * on the treadmill in the hall, sitting by the signpost…). Each stop is turned
 * into a scroll range:
 *
 *      arrive ──── dwell ──── depart            arrive ── dwell ── depart
 *                          ╲_ travel _╱
 *
 * Between `depart` of one stop and `arrive` of the next he travels. Everything
 * is a pure function of the scroll offset, so it works in both directions and
 * needs no animation state.
 *
 * The easing curves were fitted to measurements of the reference site: x follows
 * smoothstep, y follows easeOutQuad (he drops quickly, then settles), scale eases out.
 */

export type Transform = { x: number; y: number; s: number };

export type Stop = {
  id: string;
  /** Scroll offset (px) at which he reaches this stop. */
  arrive: number;
  /** Scroll offset (px) at which he leaves it. */
  depart: number;
  /** Where he stands while holding this stop, for a given scroll offset. */
  holdAt: (scroll: number) => Transform;
};

export type ActorState =
  | { kind: "hold"; stop: Stop; at: Transform }
  | { kind: "travel"; from: Stop; to: Stop; p: number; at: Transform };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);
export const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

/** Order stops by arrival and make sure each arrives after the previous one departs. */
export function normalise<T extends Stop>(stops: T[]): T[] {
  const sorted = [...stops].sort((a, b) => a.arrive - b.arrive);
  return sorted.map((stop, i) => {
    if (i === 0) return stop;
    const minArrive = sorted[i - 1].depart + 1;
    return stop.arrive >= minArrive
      ? stop
      : { ...stop, arrive: minArrive, depart: Math.max(stop.depart, minArrive + 1) };
  });
}

export function actorAt(stops: Stop[], scroll: number): ActorState | null {
  if (stops.length === 0) return null;

  const first = stops[0];
  if (scroll <= first.depart) return { kind: "hold", stop: first, at: first.holdAt(scroll) };

  for (let i = 1; i < stops.length; i++) {
    const from = stops[i - 1];
    const to = stops[i];

    if (scroll < to.arrive) {
      const p = clamp((scroll - from.depart) / (to.arrive - from.depart));
      const a = from.holdAt(from.depart);
      const b = to.holdAt(to.arrive);
      return {
        kind: "travel",
        from,
        to,
        p,
        at: {
          x: lerp(a.x, b.x, smoothstep(p)),
          y: lerp(a.y, b.y, easeOutQuad(p)),
          s: lerp(a.s, b.s, easeOutQuad(p)),
        },
      };
    }
    if (scroll <= to.depart) return { kind: "hold", stop: to, at: to.holdAt(scroll) };
  }

  const last = stops[stops.length - 1];
  return { kind: "hold", stop: last, at: last.holdAt(scroll) };
}
