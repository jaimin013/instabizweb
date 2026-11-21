# TeddyPups — website clone

A pixel-faithful, responsive clone of [puppy.instabizweb.com](https://puppy.instabizweb.com/), built as a
technical assignment for Blutec AI.

## Stack

| Concern       | Choice                                           | Why                                                            |
| ------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack), React 19     | Same as the reference; static generation for every page        |
| Styling       | Tailwind CSS v4 with a CSS-first token system    | Tokens live in CSS (`@theme`), utilities generated from them   |
| Animation     | CSS keyframes + Motion (`motion/react`)          | CSS for looping illustration motion, Motion for scroll/gesture |
| Smooth scroll | Lenis                                            | Matches the reference's weighted scrolling                     |
| Fonts         | Fraunces, Figtree, Shantell Sans via `next/font` | Self-hosted at build time, zero layout shift                   |
| Hosting       | Vercel                                           | Native Next.js hosting                                         |

There is no backend: like the original, every enquiry goes to WhatsApp, and puppy data is typed local content.

## Project structure

```
src/
  app/
    (site)/            public pages sharing the header/footer shell
    globals.css        entry point that imports the style layers
  components/
    sections/          Hero, MeetThePups, TwoWays, JourneyChat, TrustPassport…
    layout/            SiteHeader, NavLink, MobileMenu, SiteFooter, WhatsAppBar
    mascot/            Teddy: shared head, peek pose, full-body rig (TeddyActor), fur helpers
    pup/               PupProvider + PupStop/PupAnchor: the one dog that travels the page
    effects/           PawTrail (mouse + Teddy's paw prints)
    providers/         client-side providers (smooth scroll)
    icons/             PawIcon
    ui/                design-system primitives (Button, PageStub)
  hooks/               useHeaderVisibility (hide on scroll down, show on scroll up)
  lib/
    pup/               timeline (scroll → position), rig (pose maths), prints; unit-tested
    ...                fonts, site config + nav, cn() helper
  styles/
    tokens.css         design tokens: primitives → semantic → motion
    base.css           element defaults, cursor, reduced-motion
    utilities.css      custom @utility classes
    motion.css         keyframes + <dialog> menu states
public/brand/          logo
public/cursor/         custom paw cursor
PROMPTS.md             log of every AI prompt used
```

## Design tokens

1. **Primitives:** brand colours named after what they look like (`toffee`, `honey`, `cocoa`), the type scale,
   radii and the "sticker" shadows.
2. **Semantic:** role names (`surface`, `ink`, `accent`, `line`) that components use. Dark bands re-scope
   them with `.theme-cocoa`, so the same component works on both light and dark backgrounds.
3. **Motion:** shared easings (`ease-silk`, `ease-pounce`, `ease-snap`) and durations.

Open `/design-system` while the app is running to see every token rendered.

## Running locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm lint && pnpm typecheck && pnpm format:check && pnpm test
```

Requires Node.js 22 or later.

## Credits

Design, copy and puppy photography (`public/pups/`, `public/puppies/`, `public/brand/logo.png`) belong to the reference site; this repository is a non-commercial
recreation made for an assessment. Illustrations, animations and code are written from scratch.
