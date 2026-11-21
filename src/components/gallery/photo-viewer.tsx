"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
/** The least a photo needs to open in the viewer. Wall photos and puppy photos both fit. */
export type ViewerPhoto = {
  src: string;
  w: number;
  h: number;
  alt?: string;
  caption?: string;
};

/** Which photo is open (`null` = closed) and how to move around. */
export function useViewer(count: number) {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const move = useCallback(
    (by: number) => setIndex((i) => (i === null ? i : (i + by + count) % count)),
    [count],
  );
  return { index, open, close, move };
}

const Arrow = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

/**
 * Full-screen photo viewer on a native <dialog> (focus trap, Esc, inert background for free).
 * Left/right arrow keys and the buttons move between photos; clicking outside the photo closes it.
 */
export function PhotoViewer({
  photos,
  viewer,
}: {
  photos: readonly ViewerPhoto[];
  viewer: ReturnType<typeof useViewer>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { index, close, move } = viewer;
  const photo = index === null ? null : photos[index];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (index === null && dialog.open) {
      dialog.close();
      document.documentElement.style.overflow = "";
    }
  }, [index]);

  // Esc closes through our state so the page stays in sync.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [close]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [index, move]);

  return (
    <dialog ref={ref} aria-label="Photo viewer" data-lenis-prevent className="viewer">
      {photo && index !== null && (
        <>
          <button
            type="button"
            className="viewer-btn viewer-close"
            aria-label="Close photo viewer"
            onClick={close}
          >
            <Arrow d="M6 6l12 12M18 6L6 18" />
          </button>
          <div
            className="viewer-stage"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <figure key={index} className="viewer-photo">
              <Image
                src={photo.src}
                alt={photo.alt ?? "A happy TeddyPups family with their new puppy"}
                width={photo.w}
                height={photo.h}
                sizes="90vw"
                priority
              />
              {photo.caption ? (
                <figcaption className="viewer-caption font-hand">{photo.caption}</figcaption>
              ) : null}
            </figure>
          </div>
          <div className="viewer-bar">
            <button type="button" className="viewer-btn" aria-label="Previous photo" onClick={() => move(-1)}>
              <Arrow d="M15 5l-7 7 7 7" />
            </button>
            <span className="viewer-count" aria-live="polite">
              {index + 1} of {photos.length}
            </span>
            <button type="button" className="viewer-btn" aria-label="Next photo" onClick={() => move(1)}>
              <Arrow d="M9 5l7 7-7 7" />
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
