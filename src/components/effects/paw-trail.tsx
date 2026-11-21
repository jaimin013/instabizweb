"use client";

import { useEffect, useRef } from "react";
import { onFootprint, type Footprint } from "@/lib/pup/prints";

type Print = Footprint & { born: number; life: number };

const STEP = 64; // px of mouse travel between mouse prints
const MOUSE_LIFE = 1500; // ms
const PUP_LIFE = 2600; // Teddy's prints linger a little longer
const SIZE = 20;
const MAX = 60;

/** One big pad + four toes, drawn with canvas ellipses (same shape as <PawIcon>). */
function drawPaw(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const s = SIZE / 64;
  ctx.scale(s, s);
  ctx.translate(-32, -32);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#c2622b";

  ctx.beginPath();
  ctx.moveTo(32, 31);
  ctx.bezierCurveTo(24.6, 31, 17, 39, 17, 46);
  ctx.bezierCurveTo(17, 51.2, 21, 54, 25.8, 54);
  ctx.bezierCurveTo(28.4, 54, 30.4, 52.9, 32, 52.9);
  ctx.bezierCurveTo(33.6, 52.9, 35.6, 54, 38.2, 54);
  ctx.bezierCurveTo(43, 54, 47, 51.2, 47, 46);
  ctx.bezierCurveTo(47, 39, 39.4, 31, 32, 31);
  ctx.fill();

  for (const [cx, cy, rx, ry, rot] of [
    [14.6, 29.2, 4.6, 6, -0.49],
    [24.2, 16.6, 5, 6.6, -0.17],
    [39.8, 16.6, 5, 6.6, 0.17],
    [49.4, 29.2, 4.6, 6, 0.49],
  ] as const) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Paw prints on one fixed canvas, from two sources:
 *  - the mouse: prints alternate left/right of the pointer's path and fade fast
 *  - Teddy: prints (via lib/pup/prints) pinned to the page, so they scroll away
 *
 * The canvas redraws only while prints are visible, so it costs nothing at rest.
 * Mouse prints are skipped on touch screens; everything is skipped for reduced motion.
 */
export function PawTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hasMouse = window.matchMedia("(pointer: fine)").matches;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();

    const prints: Print[] = [];
    let frame = 0;

    const draw = (now: number) => {
      frame = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = prints.length - 1; i >= 0; i--) {
        if (now - prints[i].born > prints[i].life) prints.splice(i, 1);
      }
      for (const p of prints) {
        const age = (now - p.born) / p.life;
        const y = p.doc ? p.y - window.scrollY : p.y;
        // quick fade-in, long fade-out
        drawPaw(ctx, p.x, y, p.angle, 0.5 * Math.min(1, age * 8) * (1 - age));
      }
      if (prints.length) frame = requestAnimationFrame(draw);
    };

    const add = (print: Footprint, life: number) => {
      prints.push({ ...print, born: performance.now(), life });
      if (prints.length > MAX) prints.shift();
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const stopListening = onFootprint((print) => add(print, PUP_LIFE));

    // Mouse trail
    let last: { x: number; y: number } | null = null;
    let travelled = 0;
    let side = 1;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const { clientX: x, clientY: y } = event;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        travelled += Math.hypot(dx, dy);
        if (travelled >= STEP) {
          travelled = 0;
          const heading = Math.atan2(dy, dx);
          const off = 9 * side;
          side = -side;
          add(
            {
              x: x + Math.cos(heading + Math.PI / 2) * off,
              y: y + Math.sin(heading + Math.PI / 2) * off,
              angle: heading + Math.PI / 2,
              doc: false,
            },
            MOUSE_LIFE,
          );
        }
      }
      last = { x, y };
    };

    if (hasMouse) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      stopListening();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] size-full"
    />
  );
}
