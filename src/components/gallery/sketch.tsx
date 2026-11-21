import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

/**
 * A puppy "sketch": the photo cut out in a hand-wobbled blob, drawn round with a pencil line
 * (two passes, the second a lighter retrace), a coloured wash behind it and a few doodles.
 * Every blob is generated from the card's index, so a card always looks the same.
 */

/** Deterministic wobble: a closed blob as polygon points in a 0–100 box. */
function blobPoints(seed: number, radius: number, wobble: number, count = 72) {
  const pts: [number, number][] = [];
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2;
    const r =
      radius +
      wobble *
        (0.55 * Math.sin(a * 2 + seed * 1.3) +
          0.3 * Math.sin(a * 3 + seed * 2.1) +
          0.15 * Math.sin(a * 5 + seed * 0.7));
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r * 0.97]);
  }
  return pts;
}

const toPath = (pts: [number, number][], map: (v: number) => number = (v) => v) =>
  `M${pts.map(([x, y]) => `${map(x).toFixed(2)} ${map(y).toFixed(2)}`).join("L")}Z`;

function maskUrl(pts: [number, number][]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${toPath(pts)}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Doodle positions sit just outside the photo, in the 0–100 frame box. */
const doodleSlots = [
  { x: 6, y: 14 },
  { x: 94, y: 70 },
  { x: 90, y: 8 },
  { x: 8, y: 80 },
  { x: 52, y: -2 },
] as const;

function Doodle({ kind, x, y }: { kind: number; x: number; y: number }) {
  const common = {
    fill: "none",
    stroke: "var(--color-toffee)",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
  };
  switch (kind % 5) {
    case 0: // sparkle
      return (
        <path
          className="tp-sketch__doodle"
          d={`M${x} ${y - 5}Q${x} ${y} ${x + 5} ${y}Q${x} ${y} ${x} ${y + 5}Q${x} ${y} ${x - 5} ${y}Q${x} ${y} ${x} ${y - 5}Z`}
          fill="var(--color-cocoa)"
        />
      );
    case 1: // dots
      return (
        <g className="tp-sketch__doodle" fill="var(--color-cocoa)">
          <circle cx={x} cy={y} r="1.1" />
          <circle cx={x + 3.4} cy={y - 2.4} r="0.8" />
          <circle cx={x - 2.4} cy={y - 3.8} r="0.7" />
        </g>
      );
    case 2: // swirl
      return (
        <path
          className="tp-sketch__doodle"
          d={`M${x} ${y}c2-4 7-3 6 1c-1 3-5 3-5 0c0-2 3-2 3 0`}
          {...common}
          stroke="var(--color-toffee-deep)"
        />
      );
    case 3: // dashes
      return (
        <path
          className="tp-sketch__doodle"
          d={`M${x} ${y}l3-5M${x + 4} ${y + 1}l4-4M${x + 3} ${y + 5}l5-1`}
          {...common}
        />
      );
    default: // paw
      return (
        <g
          className="tp-sketch__doodle"
          fill="var(--color-toffee)"
          transform={`translate(${x - 4} ${y - 4}) scale(.13)`}
        >
          <path d="M32 31c-7.400 0-15 8-15 15 0 5.200 4 8 8.800 8 2.600 0 4.600-1.100 6.200-1.100s3.600 1.100 6.200 1.100c4.800 0 8.800-2.800 8.800-8 0-7-7.600-15-15-15z" />
          <ellipse cx="14.600" cy="29.200" rx="4.600" ry="6" />
          <ellipse cx="24.200" cy="16.600" rx="5" ry="6.600" />
          <ellipse cx="39.800" cy="16.600" rx="5" ry="6.600" />
          <ellipse cx="49.400" cy="29.200" rx="4.600" ry="6" />
        </g>
      );
  }
}

type SketchProps = {
  index: number;
  href: string;
  name: string;
  label: string;
  photo: string;
  alt: string;
  tint?: string;
  tilt: number;
  delay: number;
  wash: string;
  sizes: string;
  /** "available" sticker on the photo, or the "gone home" heart sticker on small cards. */
  sticker: "available" | "home";
  meta?: string;
  video?: boolean;
  small?: boolean;
  focus?: { x: number; y: number };
};

export function Sketch({
  index,
  href,
  name,
  label,
  photo,
  alt,
  tint,
  tilt,
  delay,
  wash,
  sizes,
  sticker,
  meta,
  video,
  small,
  focus,
}: SketchProps) {
  const seed = index * 1.7 + 0.6;
  const cut = blobPoints(seed, 46.5, 2.7);
  const mask = maskUrl(cut);
  // Pencil lines live in the frame box; the photo sits inset 4.5 % inside it.
  const frame = (v: number) => 4.5 + v * 0.91;
  const line = toPath(cut, frame);
  const retrace = toPath(blobPoints(seed + 2.4, 46.5, 3.4), frame);
  const washPath = toPath(blobPoints(seed + 4.1, 47.5, 3.8));
  const slots = [0, 1, 2].map((n) => doodleSlots[(index + n * 2) % doodleSlots.length]);

  return (
    <li>
      <Link
        className={small ? "tp-sketch tp-sketch--small" : "tp-sketch"}
        data-reveal=""
        style={{ "--tilt": `${tilt}deg`, "--d": `${delay}ms`, "--wash": wash } as CSSProperties}
        aria-label={label}
        href={href}
      >
        <span className="tp-sketch__frame">
          <svg
            className="tp-sketch__wash"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={washPath} />
          </svg>
          <span
            className="tp-sketch__photo"
            style={{ maskImage: mask, WebkitMaskImage: mask, backgroundColor: tint } as CSSProperties}
          >
            <Image
              src={photo}
              alt={alt}
              fill
              sizes={sizes}
              className="object-cover"
              style={focus ? { objectPosition: `${focus.x}% ${focus.y}%` } : undefined}
            />
          </span>
          <svg className="tp-sketch__ink" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="tp-sketch__line tp-sketch__line--retrace" d={retrace} pathLength={1} />
            <path className="tp-sketch__line" d={line} pathLength={1} />
            {slots.map((slot, n) => (
              <Doodle key={n} kind={index + n} x={slot.x} y={slot.y} />
            ))}
          </svg>
          {sticker === "available" ? (
            <span className="tp-sketch__sticker font-hand-bouncy">Available</span>
          ) : (
            <span className="tp-sketch__sticker tp-sketch__sticker--home font-hand-bouncy">gone home ♥</span>
          )}
          {video ? <span className="tp-sketch__video">▶ video</span> : null}
        </span>
        <span className="tp-sketch__name font-plush">{name}</span>
        {meta ? <span className="tp-sketch__meta">{meta}</span> : null}
      </Link>
    </li>
  );
}
