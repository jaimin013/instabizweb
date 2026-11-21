"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PawIcon } from "@/components/icons/paw";
import { TeddyRunner } from "@/components/mascot/teddy-runner";
import { site } from "@/lib/site";

/**
 * The page-change curtain: a honey blanket that slides up over the screen, Teddy runs
 * across it, and it lifts away to reveal the next page. It also plays once on first load.
 *
 *   intro    → server-rendered, so the first paint is already covered; lifts by itself
 *   covering → a link was clicked: blanket slides up (0.3s)
 *   covered  → the route is pushed; Teddy keeps running underneath
 *   lifting  → the new page is there: blanket slides off the top (0.46s)
 *   idle     → hidden, not intercepting anything
 *
 * Plain links are caught at the document so every <a> (Link, buttons, footer…) gets it
 * without any wiring. Modified clicks, new tabs, downloads, same-page links and
 * reduced motion pass straight through to the browser.
 */
type State = "intro" | "covering" | "covered" | "lifting" | "idle";

const COVER_MS = 300;
const MIN_COVERED_MS = 450;
const LIFT_MS = 460;
const GIVE_UP_MS = 4000;
const INTRO_MS = 1100;

const prints = [
  { left: "18%", top: "6px", rotate: "14deg", delay: "0.16s" },
  { left: "27%", top: "-4px", rotate: "6deg", delay: "0.28s" },
  { left: "36%", top: "7px", rotate: "18deg", delay: "0.4s" },
  { left: "45%", top: "-3px", rotate: "4deg", delay: "0.52s" },
  { left: "54%", top: "6px", rotate: "16deg", delay: "0.64s" },
] as const;

function Edge({ position }: { position: "top" | "bottom" }) {
  const id = `curtain-scallop-${position}`;
  return (
    <svg
      className={`tp-curtain__edge tp-curtain__edge--${position}`}
      width="100%"
      height="40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width="76" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 0H76V27A38 25 0 0 1 0 27Z" fill="var(--color-honey-soft)" />
          <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
          <path
            d="M11 33A27 19 0 0 1 65 33"
            fill="none"
            stroke="#2a170e"
            strokeWidth="1.6"
            strokeDasharray="3.5 5.5"
            strokeLinecap="round"
            opacity=".42"
          />
        </pattern>
      </defs>
      <rect width="100%" height="40" fill={`url(#${id})`} />
    </svg>
  );
}

/** The link to take over, with where it goes; null when the browser should handle the click itself. */
function wantsCurtain(event: MouseEvent, current: string) {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor || anchor.hasAttribute("download")) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.pathname === current) return null;
  return { href: url.pathname + url.search + url.hash, anchor };
}

export function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<State>("intro");
  const stateRef = useRef<State>("intro");
  const pending = useRef<{ from: string; since: number } | null>(null);
  const timers = useRef<number[]>([]);

  const go = (next: State) => {
    stateRef.current = next;
    setState(next);
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // First load: the curtain starts covering the page and lifts on its own.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (stateRef.current === "intro") go("idle");
    }, INTRO_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Catch internal link clicks.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (event: MouseEvent) => {
      if (stateRef.current !== "idle") return;
      const hit = wantsCurtain(event, window.location.pathname);
      if (!hit) return;
      const { href: target, anchor } = hit;
      event.preventDefault();
      event.stopPropagation();

      // A link inside the mobile menu: close the menu now, as the original does. The menu is a modal
      // <dialog> in the top layer, so it would otherwise stay on screen above the curtain (and, because we
      // stop the click here, its own close handler never runs).
      const menu = anchor.closest("dialog");
      if (menu?.open) menu.close();

      clearTimers();
      pending.current = { from: window.location.pathname, since: performance.now() };
      go("covering");
      later(() => {
        go("covered");
        router.push(target);
      }, COVER_MS);
      // If the route never arrives, do not leave the visitor staring at a curtain.
      later(() => {
        if (pending.current) lift(0);
      }, GIVE_UP_MS);
    };

    const lift = (wait: number) => {
      pending.current = null;
      later(() => {
        go("lifting");
        later(() => go("idle"), LIFT_MS);
      }, wait);
    };

    // The new route has rendered: scroll to the top and lift once the minimum cover time passed.
    const arrived = () => {
      const job = pending.current;
      if (!job || window.location.pathname === job.from) return;
      window.scrollTo({ top: 0, behavior: "instant" });
      lift(Math.max(0, MIN_COVERED_MS - (performance.now() - job.since)));
    };
    window.addEventListener("tp:route", arrived);

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("tp:route", arrived);
      clearTimers();
    };
  }, [router]);

  // Tell the effect above that the pathname changed (it owns the timers).
  useEffect(() => {
    window.dispatchEvent(new Event("tp:route"));
  }, [pathname]);

  return (
    <div className="tp-curtain" data-state={state} aria-hidden="true">
      <div className="tp-curtain__blanket">
        <Edge position="top" />
        <Edge position="bottom" />
        <div className="tp-curtain__stage">
          <div className="tp-curtain__prints">
            {prints.map((p) => (
              <PawIcon
                key={p.left}
                className="tp-curtain__print"
                style={{ left: p.left, top: p.top, rotate: p.rotate, animationDelay: p.delay }}
              />
            ))}
          </div>
          <div className="tp-curtain__runner">
            <TeddyRunner />
          </div>
          <p className="tp-curtain__note font-hand">{site.motto}</p>
        </div>
      </div>
    </div>
  );
}
