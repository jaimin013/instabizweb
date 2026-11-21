"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TeddyPeek } from "@/components/mascot/teddy-peek";
import { PupStop } from "@/components/pup/pup-layer";
import { useTeddy } from "@/hooks/use-teddy";
import { focusOf, type Puppy } from "@/data/puppies";

export type Seat = {
  slug: string;
  /** Desktop: arch centre (% of stage), width (rem), how much shows above the ledge. */
  dx: number;
  dw: number;
  dpeek: number;
  /** Phone placement. */
  mx: number;
  mpeek: number;
  /** Lean in degrees. */
  tilt: number;
};

type Phase = "duck" | "pop" | null;

/** Pause between one pup ducking and the next. Repeats, like the original's rhythm. */
const GAPS = [2500, 1700, 2300, 2000, 2800, 1800, 1900];
const DUCK_MS = 360; // photo sinks, then is swapped
const POP_MS = 700; // pop-up animation
const TAG_MS = 1800; // name tag stays after the pop

/**
 * The row of arched puppies peeking over the quilt, plus Teddy.
 *
 * Behaviour:
 *  - Every couple of seconds a random pup ducks, comes back as a different
 *    puppy (never one already on screen), and shows a name tag.
 *  - Once less than half the hero is visible everything sinks behind the quilt.
 *  - Teddy tilts his head, mutters now and then and reacts to pups popping up.
 *
 * With reduced motion the arrangement stays static.
 */
export function HeroStage({ seats, puppies }: { seats: readonly Seat[]; puppies: readonly Puppy[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const teddyRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const [here, setHere] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [shown, setShown] = useState(() => seats.map((s) => s.slug));
  const [phases, setPhases] = useState<Phase[]>(() => seats.map(() => null));
  const [tagSeat, setTagSeat] = useState<number | null>(null);

  const running = here && tabVisible && !reduceMotion;
  const teddy = useTeddy(running);

  // Keep the latest values available to the timer chain without restarting it.
  const shownRef = useRef(shown);
  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);
  const reactRef = useRef(teddy.react);
  useEffect(() => {
    reactRef.current = teddy.react;
  }, [teddy.react]);

  // Sink the pups when the hero is mostly scrolled away.
  useEffect(() => {
    const hero = stageRef.current?.closest("section");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHere(entry.intersectionRatio >= 0.5), {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  // The duck → swap → pop cycle.
  useEffect(() => {
    if (!running) return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const setPhase = (seat: number, phase: Phase) =>
      setPhases((prev) => prev.map((p, i) => (i === seat ? phase : p)));

    let last = -1;
    let step = 0;

    const run = () => {
      let seat = Math.floor(Math.random() * seats.length);
      if (seat === last) seat = (seat + 1 + Math.floor(Math.random() * (seats.length - 1))) % seats.length;
      last = seat;

      setPhase(seat, "duck");

      later(() => {
        const onScreen = new Set(shownRef.current);
        const options = puppies.filter((p) => !onScreen.has(p.slug));
        const next = options[Math.floor(Math.random() * options.length)];
        if (next) setShown((prev) => prev.map((slug, i) => (i === seat ? next.slug : slug)));
        setPhase(seat, "pop");
        setTagSeat(seat);
        reactRef.current(seats[seat].dx < 50 ? -1 : 1);
      }, DUCK_MS);

      later(() => setPhase(seat, null), DUCK_MS + POP_MS);
      later(() => setTagSeat((current) => (current === seat ? null : current)), DUCK_MS + TAG_MS);
      later(run, GAPS[step++ % GAPS.length]);
    };

    later(run, 400);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [running, seats, puppies]);

  return (
    <div ref={stageRef} className="hero-stage" data-here={here}>
      <button
        ref={teddyRef}
        type="button"
        onClick={teddy.poke}
        aria-label="Say hi to Teddy"
        className="hero-teddy teddy-peek"
      >
        <TeddyPeek className="teddy-svg" tilt={teddy.tilt} happy={teddy.happy} />
        <span
          aria-hidden="true"
          className="teddy-bubble font-hand-bouncy"
          data-show={teddy.bubble.show}
          data-side={teddy.tilt < 0 ? "left" : "right"}
        >
          {teddy.bubble.text}
        </span>
      </button>

      {/* While he is peeking here the page draws him; once he walks off, the roaming dog takes over. */}
      <PupStop id="hero" pose="peek" fit="peek" local target={teddyRef} leaveAt={0.29} />

      <ul className="lineup" aria-label="Some of the puppies in our showroom">
        {seats.map((seat, i) => {
          const puppy = puppies.find((p) => p.slug === shown[i]);
          if (!puppy) return null;
          const style = {
            "--dx": `${seat.dx}%`,
            "--dw": `${seat.dw}rem`,
            "--dpeek": seat.dpeek,
            "--mx": `${seat.mx}%`,
            "--mw": "17vw",
            "--mpeek": seat.mpeek,
            "--tilt": `${seat.tilt}deg`,
            "--i": i,
          } as CSSProperties;

          return (
            <li key={i} className="seat" style={style} data-tag={tagSeat === i ? "show" : undefined}>
              <Link
                href={`/puppies/${puppy.slug}`}
                aria-label={`Meet ${puppy.name}`}
                className="seat-pup outline-offset-4"
                data-state={phases[i] ?? undefined}
              >
                <span className="seat-photo" style={{ backgroundColor: puppy.photo.tint }}>
                  <Image
                    key={puppy.slug}
                    src={puppy.photo.src}
                    alt={puppy.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 12rem, 22vw"
                    loading="eager"
                    fetchPriority={i < 3 ? "high" : "auto"}
                    className="object-cover"
                    style={{ objectPosition: focusOf(puppy.photo) }}
                  />
                </span>
              </Link>
              <span aria-hidden="true" className="seat-name font-display font-semibold">
                {puppy.name}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="quilt" aria-hidden="true">
        <svg className="quilt-edge" width="100%" height="40" preserveAspectRatio="none">
          <defs>
            <pattern id="quilt-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="var(--quilt)" />
              <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
              <path
                d="M11 33A27 19 0 0 1 65 33"
                fill="none"
                stroke="#2a170e"
                strokeOpacity="0.35"
                strokeWidth="1.6"
                strokeDasharray="4 5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="40" fill="url(#quilt-scallop)" />
        </svg>
      </div>
    </div>
  );
}
