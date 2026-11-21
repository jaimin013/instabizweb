"use client";

import { useEffect, useRef } from "react";

/**
 * The bookmark ribbon down the left edge of a puppy page (desktop only). It stays in view while
 * you read, and the band grows as you move through the "storybook". It writes its own transform,
 * so scrolling never re-renders React.
 */
export function StoryRibbon() {
  const band = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = band.current;
    const article = el?.closest("article");
    if (!el || !article) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = article.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - rect.top) / rect.height;
      el.style.transform = `scaleY(${Math.min(1, Math.max(0, progress))})`;
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="tp-ribbon">
      <div className="tp-ribbon__track">
        <span ref={band} className="tp-ribbon__band" style={{ transform: "scaleY(0)" }} />
      </div>
    </div>
  );
}
