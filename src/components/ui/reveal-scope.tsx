"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Arms every `[data-reveal]` inside it (`data-armed`) and marks it `data-revealed` as it scrolls
 * into view, so CSS can fade/slide/stamp it in. Without JavaScript nothing is hidden, because
 * "armed" is only ever set here. With reduced motion everything is revealed at once.
 */
export function RevealScope({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    targets.forEach((el) => {
      el.setAttribute("data-armed", "");
      if (reduce) el.setAttribute("data-revealed", "");
    });
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={className ? undefined : { display: "contents" }}>
      {children}
    </div>
  );
}
