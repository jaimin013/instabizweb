"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Things Teddy mutters on his own. "hm?" is by far the most common, as on the original. */
const IDLE_LINES = ["hm?", "hm?", "hm?", "psst…", "*sniff*", "hehe", "boop!", "hello?"];
/** When a pup pops up beside him. */
const REACT_LINES = ["hm?", "ooh!", "hi!", "who's that?", "hm?"];
/** When he's poked. */
const POKE_LINES = ["woof!", "hehe!", "again!", "yay!", "boop!"];

const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const between = (min: number, max: number) => min + Math.random() * (max - min);

type Act = { tilt?: number; text?: string; happy?: boolean; hold?: number };

/**
 * Teddy's little personality: a head tilt, an optional speech bubble and a
 * happy face, all of which settle back to neutral after `hold` ms.
 *
 * - idle: every 6–11 s he tilts his head and sometimes says something
 * - react(side): he glances toward a pup that just popped up
 * - poke(): click/tap for a happy face and a woof
 *
 * `enabled` turns the automatic behaviour off (hero off-screen, reduced motion).
 */
export function useTeddy(enabled: boolean) {
  const [tilt, setTilt] = useState(0);
  const [happy, setHappy] = useState(false);
  const [bubble, setBubble] = useState({ text: "", show: false });
  const resetTimer = useRef<number | undefined>(undefined);

  const perform = useCallback(({ tilt = 0, text, happy = false, hold = 1500 }: Act) => {
    window.clearTimeout(resetTimer.current);
    setTilt(tilt);
    setHappy(happy);
    if (text) setBubble({ text, show: true });
    resetTimer.current = window.setTimeout(() => {
      setTilt(0);
      setHappy(false);
      setBubble((b) => ({ ...b, show: false }));
    }, hold);
  }, []);

  // Automatic idle behaviour.
  useEffect(() => {
    if (!enabled) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          const side = Math.random() < 0.5 ? -1 : 1;
          perform({
            tilt: side * between(6, 10),
            text: Math.random() < 0.55 ? pick(IDLE_LINES) : undefined,
            hold: 1700,
          });
          schedule();
        },
        between(6000, 11000),
      );
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [enabled, perform]);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  /** Glance toward a side (-1 left, 1 right); only sometimes, so it feels spontaneous. */
  const react = useCallback(
    (side: -1 | 1) => {
      if (enabled && Math.random() < 0.3) perform({ tilt: side * 8, text: pick(REACT_LINES), hold: 1500 });
    },
    [enabled, perform],
  );

  const poke = useCallback(() => perform({ happy: true, text: pick(POKE_LINES), hold: 1700 }), [perform]);

  return { tilt, happy, bubble, react, poke };
}
