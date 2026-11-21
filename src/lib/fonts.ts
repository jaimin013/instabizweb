import { Figtree, Fraunces, Shantell_Sans } from "next/font/google";

/**
 * All three are variable Google Fonts, self-hosted at build time by
 * next/font (no runtime request to Google, no layout shift thanks to
 * the generated size-adjusted fallback).
 *
 * Each exposes a CSS variable that tokens.css maps to a Tailwind
 * family: font-sans / font-display / font-hand.
 */

/** Body copy, nav, buttons. */
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree-var",
  display: "swap",
});

/** Display headings. Extra axes power the soft / wonky letterforms. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces-var",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

/** Handwritten notes ("every puppy is family"). */
const shantell = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-shantell-var",
  display: "swap",
  axes: ["BNCE", "INFM"],
});

export const fontVariables = [figtree.variable, fraunces.variable, shantell.variable].join(" ");
