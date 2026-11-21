"use client";

import { useCallback, useEffect, useState } from "react";

type HeaderState = { scrolled: boolean; hidden: boolean };

/**
 * Drives the header's two visual states from window scroll:
 *  - `scrolled`: the page has left the top, so the header gains a solid backdrop
 *  - `hidden`: the user is scrolling down, so the header slides away
 *
 * Small movements are accumulated against a threshold so a trackpad
 * wobble doesn't make the header flicker. Works with Lenis because
 * Lenis drives the native window scroll position.
 */
export function useHeaderVisibility({ threshold = 10, revealBelow = 120 } = {}) {
  const [state, setState] = useState<HeaderState>({ scrolled: false, hidden: false });

  useEffect(() => {
    let anchor = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - anchor;

      setState((prev) => {
        const scrolled = y > 8;
        let hidden = prev.hidden;
        if (y < revealBelow || delta < -threshold) hidden = false;
        else if (delta > threshold) hidden = true;
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden };
      });

      if (Math.abs(delta) > threshold || y < revealBelow) anchor = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold, revealBelow]);

  /** Force the header visible (e.g. when a link inside it receives keyboard focus). */
  const reveal = useCallback(() => setState((prev) => (prev.hidden ? { ...prev, hidden: false } : prev)), []);

  return { ...state, reveal };
}
