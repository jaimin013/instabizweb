"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { PupAnchor } from "@/components/pup/pup-layer";
import { ButtonLink } from "@/components/ui/button";
import { getPuppy } from "@/data/puppies";

/** The dotted flight path in the svg's 660 × 300 space (a cubic bezier). */
const ROUTE = [
  [40, 250],
  [170, 40],
  [470, 20],
  [620, 168],
] as const;

function routePoint(t: number): [number, number] {
  const u = 1 - t;
  const [p0, p1, p2, p3] = ROUTE;
  return [
    u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
    u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
  ];
}

/** Direction of travel (degrees) at `t`, so the plane always points along the route. */
function routeAngle(t: number) {
  const u = 1 - t;
  const [p0, p1, p2, p3] = ROUTE;
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

const ROUTE_PATH = `M${ROUTE[0]} C ${ROUTE[1]}, ${ROUTE[2]}, ${ROUTE[3]}`;

/** Placing the plane at progress `t` along the route (0 = Korea, 1 = Dubai). */
function planeTransform(t: number) {
  const [x, y] = routePoint(t);
  return `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${routeAngle(t).toFixed(1)})`;
}

/** Line-art Dubai skyline, drawn for this site. */
const SKYLINE =
  "M0 118H300M22 118V84H44V118M54 118V70H68V118M88 118V62L94 26L97 6L100 26L106 62V118M118 118V60L144 50V118M154 118V44H176V118M186 118V76H208V118M216 118V82H242V118M250 118V96H278V118";

/**
 * "Two ways to meet your puppy".
 *
 * The plane is tied to scroll: progress along the route is 0 when the section's
 * top edge is half a screen below the top of the viewport and 1 when it is half a
 * screen above it, i.e. it flies across as you scroll through the section.
 */
export function TwoWays() {
  const reduceMotion = useReducedMotion();
  const clipId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const passenger = getPuppy("korean-teacup-maltipoo-female");

  useEffect(() => {
    const section = sectionRef.current;
    const plane = planeRef.current;
    if (!section || !plane) return;

    if (reduceMotion) {
      plane.setAttribute("transform", planeTransform(0.55));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const t = Math.min(1, Math.max(0, (0.5 * vh - section.getBoundingClientRect().top) / vh));
      plane.setAttribute("transform", planeTransform(t));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <section data-pup-lane="" ref={sectionRef} aria-labelledby="paths-title" className="paths">
      <div className="container-wide">
        <h2 id="paths-title" className="paths-title text-huge">
          Two ways to meet your puppy
        </h2>

        <div className="fork">
          <div aria-hidden="true" className="fork-post" />

          <article className="way way--left" aria-labelledby="way-local">
            <h3 id="way-local" className="sign sign--left font-plush">
              Puppies in Dubai
            </h3>
            <div className="way-scene">
              <svg viewBox="0 0 300 120" className="way-skyline" aria-hidden="true">
                <path
                  d={SKYLINE}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <figure className="window">
                <span className="window-glass">
                  <Image
                    src="/puppies/showroom.jpg"
                    alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom"
                    fill
                    sizes="(min-width: 1024px) 16rem, 60vw"
                    className="object-cover"
                    style={{ objectPosition: "54.3% 48.3%" }}
                  />
                </span>
                <figcaption className="font-hand">In our showroom</figcaption>
              </figure>
            </div>
            <p className="way-text">
              See them, love them, take them home. Come meet our locally available puppies before you decide.
            </p>
            <ButtonLink href="/puppies?origin=local" className="way-cta">
              Meet local puppies
            </ButtonLink>
          </article>

          <article className="way way--right" aria-labelledby="way-imported">
            <h3 id="way-imported" className="sign sign--right font-plush">
              Imported for you
            </h3>
            <div className="way-scene">
              <div className="flight">
                <svg
                  viewBox="0 0 660 300"
                  role="img"
                  aria-label="A plane bringing a Korean Teacup Maltipoo puppy from Korea to Dubai"
                >
                  <defs>
                    <clipPath id={clipId}>
                      <circle r="25" />
                    </clipPath>
                  </defs>
                  <path d={ROUTE_PATH} className="flight-route" />
                  <circle cx="40" cy="250" r="7" className="flight-dot" />
                  <circle cx="620" cy="168" r="7" className="flight-dot" />
                  <text x="40" y="284" textAnchor="middle" className="flight-label">
                    Korea
                  </text>
                  <text x="620" y="202" textAnchor="middle" className="flight-label">
                    Dubai
                  </text>

                  {/* The plane: drawn at the origin pointing right; the transform places and turns it. */}
                  <g ref={planeRef} transform={planeTransform(0.55)}>
                    <g className="plane-art" transform="scale(1.22)">
                      <path d="M-26 -16L-58 -66L-22 -66L18 -16Z" className="flight-wing flight-wing--far" />
                      <path d="M-62 -14L-84 -46L-52 -46L-34 -14Z" className="flight-wing" />
                      <path
                        d="M-88 0C-88 -20 -62 -30 -14 -30H38C74 -30 96 -16 96 0C96 16 74 30 38 30H-14C-62 30 -88 20 -88 0Z"
                        className="flight-body"
                      />
                      <path d="M-22 16L-56 68L-18 68L24 16Z" className="flight-wing" />
                      <path d="M66 -14C78 -11 86 -4 90 6" className="flight-line" />
                      {passenger && (
                        <g transform="translate(14 -2)">
                          <image
                            href={passenger.photo.src}
                            x="-25"
                            y="-25"
                            width="50"
                            height="50"
                            clipPath={`url(#${clipId})`}
                            preserveAspectRatio="xMidYMid slice"
                          />
                          <circle r="25" className="flight-porthole" />
                        </g>
                      )}
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            <p className="way-text">
              Exclusive Korean teacup puppies, delivered. Order from the world&apos;s most reputable breeders
              and let us handle the import.
            </p>
            <ButtonLink href="/puppies?origin=imported" className="way-cta">
              See imported puppies
            </ButtonLink>
          </article>

          {/* Teddy sits at the foot of the signpost */}
          <PupAnchor id="fork" pose="sit" fit="foot" className="fork-teddy" />
        </div>
      </div>
    </section>
  );
}
