"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PhotoViewer, useViewer } from "@/components/gallery/photo-viewer";
import { MEDIA_EVENT } from "@/components/pup-page/tag-buddy";
import type { PupMedia } from "@/data/pups";
import { cn } from "@/lib/cn";

const crop = (m: PupMedia) => ({ objectPosition: `${m.focus.x}% ${m.focus.y}%` });

/**
 * The big photo "page" with arrows, a counter, a strip of thumbnails and a full-screen viewer.
 * Videos play in the page itself. Works for any number of photos (one hides the controls).
 */
export function PupGallery({ name, media }: { name: string; media: readonly PupMedia[] }) {
  const [index, setIndex] = useState(0);
  const photos = useMemo(() => media.map((m) => ({ src: m.src, w: m.w, h: m.h, alt: m.alt })), [media]);
  const viewer = useViewer(media.length);
  const many = media.length > 1;
  const item = media[index];
  const kind = (m: PupMedia, n: number) =>
    `${name}, ${m.kind === "video" ? "video" : "photo"} ${n + 1} of ${media.length}`;

  const show = (to: number) => {
    const next = (to + media.length) % media.length;
    if (next === index) return;
    setIndex(next);
    window.dispatchEvent(new CustomEvent(MEDIA_EVENT, { detail: { video: media[next].kind === "video" } }));
  };

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        <div key={index} className={cn("absolute inset-0", index > 0 && "tp-turn")}>
          {item.kind === "video" && item.video ? (
            <video
              src={item.video}
              poster={item.src}
              controls
              playsInline
              preload="metadata"
              aria-label={item.alt}
              className="absolute inset-0 size-full object-cover"
              style={crop(item)}
            />
          ) : (
            <button
              type="button"
              className="absolute inset-0 block size-full"
              aria-label={`Open ${kind(item, index)} full screen`}
              onClick={() => viewer.open(index)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="object-cover"
                style={{ ...crop(item), backgroundColor: item.color }}
              />
            </button>
          )}
        </div>

        {many ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-x-4 flex justify-between",
              item.kind === "video" ? "bottom-20" : "bottom-4",
            )}
          >
            <button
              type="button"
              className="pointer-events-auto grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
              aria-label="Previous photo"
              onClick={() => show(index - 1)}
            >
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {index + 1} / {media.length}
            </span>
            <button
              type="button"
              className="pointer-events-auto grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
              aria-label="Next photo"
              onClick={() => show(index + 1)}
            >
              ›
            </button>
          </div>
        ) : null}
      </div>

      {many ? (
        <ul
          className="mt-3 flex [scrollbar-width:thin] gap-3 overflow-x-auto px-1 pt-2 pb-2"
          aria-label={`All photos of ${name}`}
        >
          {media.map((m, n) => (
            <li key={m.src} className="shrink-0">
              <button
                type="button"
                aria-label={kind(m, n)}
                aria-current={n === index}
                onClick={() => show(n)}
                className={cn(
                  "relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24",
                  n === index
                    ? "-translate-y-1 -rotate-3 border-toffee-deep"
                    : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa",
                )}
              >
                <Image
                  src={m.src}
                  alt=""
                  fill
                  sizes="6rem"
                  loading={n === 0 ? "eager" : "lazy"}
                  className="object-cover"
                  style={crop(m)}
                />
                {m.kind === "video" ? (
                  <span
                    className="absolute inset-0 grid place-items-center bg-cocoa/25 text-milk"
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <PhotoViewer photos={photos} viewer={viewer} />
    </div>
  );
}
