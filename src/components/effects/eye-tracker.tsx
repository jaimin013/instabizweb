"use client";

import { useEffect } from "react";

/**
 * Makes every Teddy on the page look at the cursor, and blush when his face is clicked.
 *
 * Teddy's eyes are a `data-part="eyes"` group inside each drawing (the roaming one, the peeking one,
 * the basket one). Here the group slides a few drawing units toward the pointer, smoothly, and eases
 * back to centre when the pointer leaves. Clicking his face sets `data-blush` on his svg for a moment:
 * CSS (motion.css) closes his eyes, pinks his cheeks, then opens the eyes again, brighter.
 * Nothing here re-renders React or blocks a click.
 */
const REACH_X = 5; // how far the eyes may slide, in drawing units
const REACH_Y = 3.4;
const FAR = 240; // px from the face at which the eyes are fully turned
const BLUSH_MS = 2400;

type Face = { svg: SVGSVGElement; eyes: SVGGElement; head: Element };

function faces(): Face[] {
  const found: Face[] = [];
  document.querySelectorAll<SVGGElement>('[data-part="eyes"]').forEach((eyes) => {
    const svg = eyes.ownerSVGElement;
    if (!svg || getComputedStyle(svg).visibility === "hidden") return;
    found.push({ svg, eyes, head: svg.querySelector('[data-part="head"]') ?? svg });
  });
  return found;
}

export function EyeTracker() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    const current = new WeakMap<SVGGElement, { x: number; y: number }>();

    const update = () => {
      frame = 0;
      let moving = false;
      for (const { svg, eyes, head } of faces()) {
        // Until there has been a pointer, leave every eye alone: some Teddys sit in parts of the page that
        // hydrate later, and writing an attribute on unhydrated markup would make React report a mismatch.
        if (!pointer && !current.has(eyes)) continue;
        const box = head.getBoundingClientRect();
        if (box.width < 8) continue;
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height * 0.55;
        let tx = 0;
        let ty = 0;
        if (pointer) {
          const dx = pointer.x - cx;
          const dy = pointer.y - cy;
          const len = Math.hypot(dx, dy) || 1;
          const pull = Math.min(1, len / FAR);
          // A mirrored Teddy (facing left) has his x axis flipped.
          const flip = (eyes.getScreenCTM()?.a ?? 1) < 0 ? -1 : 1;
          tx = (dx / len) * pull * REACH_X * flip;
          ty = (dy / len) * pull * REACH_Y;
        }
        const at = current.get(eyes) ?? { x: 0, y: 0 };
        at.x += (tx - at.x) * 0.22;
        at.y += (ty - at.y) * 0.22;
        current.set(eyes, at);
        const value = `translate(${at.x.toFixed(2)} ${at.y.toFixed(2)})`;
        if (eyes.getAttribute("transform") !== value) eyes.setAttribute("transform", value);
        if (Math.abs(tx - at.x) > 0.02 || Math.abs(ty - at.y) > 0.02) moving = true;
        void svg;
      }
      if (moving) frame = requestAnimationFrame(update);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      queue();
    };
    const onLeave = () => {
      pointer = null;
      queue();
    };

    const timers = new Map<SVGSVGElement, number>();
    const onDown = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      queue();
      // A tap on a link or button is for that control, not for the face behind it.
      if ((event.target as Element | null)?.closest?.("a, button, input, select, textarea, summary, label"))
        return;
      for (const { svg, head } of faces()) {
        const box = head.getBoundingClientRect();
        const r = Math.min(box.width, box.height) / 2;
        const hit =
          Math.hypot(
            event.clientX - (box.left + box.width / 2),
            event.clientY - (box.top + box.height * 0.55),
          ) <
          r * 0.8;
        if (!hit) continue;
        window.clearTimeout(timers.get(svg));
        svg.removeAttribute("data-blush");
        void svg.getBoundingClientRect(); // restart the animation if he is already blushing
        svg.setAttribute("data-blush", "true");
        timers.set(
          svg,
          window.setTimeout(() => svg.removeAttribute("data-blush"), BLUSH_MS),
        );
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", queue);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return null;
}
