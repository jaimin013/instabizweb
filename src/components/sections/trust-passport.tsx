import type { CSSProperties, ReactNode } from "react";
import { PupAnchor } from "@/components/pup/pup-layer";

type Entry = {
  title: string;
  text: string;
  shape: "round" | "ticket" | "oval" | "scallop";
  ink: string;
  tilt: number;
  icon: ReactNode;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const entries: readonly Entry[] = [
  {
    title: "Vet-checked & healthy",
    text: "Every puppy comes vaccinated, dewormed, and with a verified health certificate.",
    shape: "round",
    ink: "#a24a1a",
    tilt: -8,
    // heart with a heartbeat line
    icon: (
      <>
        <path
          d="M32 55C14 43 9 31 9 23c0-7 5-12 11-12 5 0 9 3 12 7 3-4 7-7 12-7 6 0 11 5 11 12 0 8-5 20-23 32z"
          {...stroke}
        />
        <path d="M19 31h8l3-8 5 15 3-7h9" {...stroke} />
      </>
    ),
  },
  {
    title: "Korea to Dubai, safely",
    text: "Trusted breeders, safe travel, and premium care from start to finish.",
    shape: "ticket",
    ink: "#1f6b45",
    tilt: 5,
    // a plane over a dotted route
    icon: (
      <>
        <path d="M8 36l46-20-9 24-13-4-9 10-2-13z" {...stroke} />
        <path d="M8 52c10 4 22 4 32 0" {...stroke} strokeDasharray="2 7" />
      </>
    ),
  },
  {
    title: "Support 24/7",
    text: "Always here to help, from choosing your puppy to post-delivery support.",
    shape: "oval",
    ink: "#5a3a28",
    tilt: -4,
    // a headset
    icon: (
      <>
        <path d="M13 36v-6a19 19 0 0 1 38 0v6" {...stroke} />
        <rect x="9" y="35" width="9" height="15" rx="4" {...stroke} />
        <rect x="46" y="35" width="9" height="15" rx="4" {...stroke} />
        <path d="M50 50c0 6-7 8-14 8" {...stroke} />
      </>
    ),
  },
  {
    title: "Trusted by families worldwide",
    text: "Puppies delivered to loving homes all around the world.",
    shape: "scallop",
    ink: "#c2622b",
    tilt: 7,
    // a globe
    icon: (
      <>
        <circle cx="32" cy="32" r="21" {...stroke} />
        <path d="M11 32h42M32 11c-9 9-9 33 0 42M32 11c9 9 9 33 0 42" {...stroke} />
      </>
    ),
  },
];

/** A skyline silhouette: building heights (out of 100) across the width, drawn left to right. */
const SKYLINE = [
  38, 52, 34, 66, 44, 58, 30, 76, 48, 40, 62, 36, 54, 90, 46, 34, 60, 42, 70, 38, 50, 64, 32, 56,
];
const CITY_PATH = (() => {
  const step = 1440 / SKYLINE.length;
  let d = "M0 160";
  SKYLINE.forEach((h, i) => {
    const y = 160 - (h / 100) * 140;
    d += `V${y.toFixed(0)}H${((i + 1) * step).toFixed(0)}`;
  });
  return `${d}V160Z`;
})();

/** "Why families trust TeddyPups": the puppy passport. */
export function TrustPassport() {
  return (
    <section data-pup-lane="" aria-labelledby="trust-title" className="passport">
      <div className="mx-auto w-full max-w-[96rem] px-(--gutter)">
        <div className="book">
          <div className="book-page book-page--left">
            <p aria-hidden="true" className="book-kicker font-hand-bouncy">
              puppy passport
            </p>
            <h2 id="trust-title" className="book-title">
              Why families trust TeddyPups
            </h2>
            <PupAnchor id="book" pose="sit" fit="foot" className="book-teddy" />
          </div>

          <ul className="book-page book-page--right">
            {entries.map((entry, i) => (
              <li
                key={entry.title}
                className="entry"
                style={{ "--ink-stamp": entry.ink, "--tilt": `${entry.tilt}deg`, "--i": i } as CSSProperties}
              >
                <span className={`stamp stamp--${entry.shape}`}>
                  <svg viewBox="0 0 64 64" className="stamp-icon" aria-hidden="true">
                    {entry.icon}
                  </svg>
                  <span className="stamp-title font-plush">{entry.title}</span>
                </span>
                <p className="entry-text">{entry.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden="true" className="horizon">
        <span className="horizon-sun" />
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="horizon-city">
          <path d={CITY_PATH} />
        </svg>
      </div>
    </section>
  );
}
