"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { PawIcon } from "@/components/icons/paw";
import { PupStop } from "@/components/pup/pup-layer";
import { ButtonLink } from "@/components/ui/button";
import { focusOf, type Puppy } from "@/data/puppies";

/** Track pixels moved per pixel of page scroll. Above 1 so the hall feels brisk. */
const SPEED = 1.25;
/** A door swings open once its centre passes this fraction of the viewport width (from the left). */
const OPEN_AT = 0.48;

/**
 * "Meet the pups": a hall of doors that slides sideways as you scroll down the page.
 *
 * How the pin works: the <section> is made tall (one screen + the distance the
 * track has to travel ÷ SPEED). Inside it, the stage is `position: sticky`, so
 * it stays on screen while the page scrolls underneath. On every scroll we turn
 * "how far into the section are we" into a translateX on the track, which makes
 * vertical scrolling drive horizontal movement.
 *
 * Doors in the left half of the screen open to show their puppy; Teddy trots on
 * the spot at the left. Reduced-motion users get a plain grid instead.
 */
const WIDE = "(min-width: 768px)";
const subscribeWide = (notify: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};

export function MeetThePups({ puppies }: { puppies: readonly Puppy[] }) {
  const reduceMotion = useReducedMotion();
  // The hall only slides sideways on wide screens; phones get a two-column grid of doors (see meet.css).
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
  const pinned = !reduceMotion && wide;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const teddyRef = useRef<HTMLDivElement>(null);
  const shiftRef = useRef(0);

  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    const floor = floorRef.current;
    if (!section || !track || !floor) return;

    const doors = Array.from(track.querySelectorAll<HTMLElement>(".door"));
    let centres: number[] = [];
    let pinLength = 0;
    let viewport = window.innerWidth;
    let frame = 0;

    const measure = () => {
      viewport = window.innerWidth;
      pinLength = Math.max(0, track.scrollWidth - viewport) / SPEED;
      section.style.height = `calc(100svh + ${pinLength}px)`;
      centres = doors.map((door) => door.offsetLeft + door.offsetWidth / 2);
      update();
    };

    const update = () => {
      frame = 0;
      const scrolled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), pinLength);
      const shift = scrolled * SPEED;
      shiftRef.current = shift;

      track.style.transform = `translate3d(${-shift}px,0,0)`;
      floor.style.setProperty("--floor-x", `${-shift}px`);

      doors.forEach((door, i) => {
        const open = String(centres[i] - shift < viewport * OPEN_AT);
        if (door.dataset.open !== open) door.dataset.open = open;
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
      section.style.height = "";
      track.style.transform = "";
      floor.style.removeProperty("--floor-x");
      doors.forEach((door) => door.removeAttribute("data-open"));
    };
  }, [pinned]);

  return (
    <section
      data-pup-lane=""
      ref={sectionRef}
      aria-labelledby="meet-title"
      className="meet"
      data-pinned={pinned ? "" : undefined}
      style={{ "--pin-fallback": "420svh" } as CSSProperties}
    >
      <div ref={stageRef} className="meet-stage">
        <header className="meet-head">
          <div>
            <h2 id="meet-title" className="text-huge">
              Meet the pups
            </h2>
            <p className="mt-3 max-w-[44ch] text-lede text-ink-soft">
              Real puppies, real photos, looking for their families right now.
            </p>
          </div>
          <ButtonLink href="/puppies" className="shrink-0">
            See all available puppies
          </ButtonLink>
        </header>

        <div className="meet-hall">
          <ol ref={trackRef} className="meet-track" aria-label="Puppies looking for a family">
            {puppies.map((puppy) => (
              <li key={puppy.slug} className="door" data-open={reduceMotion ? "true" : undefined}>
                <Link
                  href={`/puppies/${puppy.slug}`}
                  className="door-link"
                  style={{ "--door": puppy.door } as CSSProperties}
                >
                  <span className="door-plate">
                    <span className="door-name font-plush">{puppy.name}</span>
                    <span className="door-meta">{puppy.details}</span>
                  </span>
                  <span className="door-frame">
                    <span className="door-way">
                      <span className="door-room" style={{ backgroundColor: puppy.photo.tint }}>
                        <Image
                          src={puppy.photo.src}
                          alt={puppy.photo.alt}
                          fill
                          sizes="(min-width: 1024px) 16rem, 44vw"
                          className="object-cover"
                          style={{ objectPosition: focusOf(puppy.photo) }}
                        />
                      </span>
                      <span className="door-leaf" aria-hidden="true">
                        <PawIcon className="door-peephole" />
                        <span className="door-knob" />
                      </span>
                    </span>
                    <span className="door-tag font-hand">Available</span>
                  </span>
                </Link>
              </li>
            ))}

            <li className="door door--all">
              <Link href="/puppies" className="door-link">
                <span className="door-frame door-frame--all">
                  <span className="door-all font-plush">Meet them all</span>
                </span>
              </Link>
            </li>
          </ol>

          <div ref={floorRef} className="meet-floor" aria-hidden="true" />
          {/* Where Teddy stands in the hall. The roaming dog (PupLayer) walks here and treads on the spot. */}
          <div ref={teddyRef} className="meet-teddy" aria-hidden="true" />
          <PupStop
            id="meet"
            pose="walk"
            fit="foot"
            target={teddyRef}
            pin={{ section: sectionRef, stage: stageRef }}
            treadmill={shiftRef}
          />
        </div>
      </div>
    </section>
  );
}
