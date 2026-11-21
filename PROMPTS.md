# AI Prompt Log

**Tool:** Claude Code (CLI) — model: Claude Opus 5.5 (Phases 0–1), Claude Sonnet 5.5 (Phase 2 onward)
**Role given to the AI:** senior software engineer / pair programmer. I set the direction and approved every decision. The AI did the research, wrote code and verified it, and I reviewed the output after each phase.

> **Note on wording:** Prompts below are copied from my sessions. I corrected spelling and grammar
> for readability; the meaning, the instructions and the order are unchanged.
> Screenshots I attached are described in _[brackets]_.

---

## Phase 0 — Analysis & planning

### Prompt 1 — Understanding the assignment and reverse-engineering the site

> I've been shortlisted for a technical round. _[Pasted the assignment email: clone
> https://puppy.instabizweb.com/, deploy it, share the GitHub repo, and record a Loom video
> covering the process, tools, AI prompts, decisions, and testing.]_
>
> Do I have to share the exact prompts too? Please check out this site. Can you reverse-engineer
> its design? At what level should we clone it: frontend only, or the backend too? What about
> animations, fonts, colour palettes and so on? There are many details. What I want is the best
> possible clone in terms of layout and responsiveness, with a tech stack that suits the design.
> _[Attached a Wappalyzer screenshot showing Next.js 16.4, React, Tailwind CSS, Framer Motion,
> Lenis, and a screenshot of the hero section.]_ I think it uses this stack. Everything is
> animated: every frame, the cursor, the paw prints and so on. We need to plan it so I can
> explain how I built it.

**What the AI did:**

- Downloaded the live HTML and CSS and pulled out the real design tokens: 11 brand colours, three Google
  Fonts (Fraunces, Figtree, Shantell Sans) with their variable-font axes, about 45 `tp-*` keyframe
  animations, breakpoints and the route map (8 pages plus 16 puppy detail pages).
- Found that the site has **no backend**: no forms and no API routes. Every CTA is a WhatsApp
  `wa.me` link, so the clone is a statically generated frontend with typed local data.
- Proposed a seven-phase plan for the 48-hour window.

---

## Phase 1 — Project setup & design system

### Prompt 2 — Scaffold, tooling and design tokens

> OK, start Phase 1 and maintain the prompts file. Use the latest tech stack, for example
> Next.js with no known vulnerabilities and the latest Tailwind, and follow best practices for
> the design token system (I assume you're building a design system). Set up the fonts too, and
> tell me if you can't. For Git, just initialise the repo; I'll give you the remote origin later.
> You'll act as my senior SWE when making decisions, including design. Make the layout accurate
> and add whatever else is needed.

**What the AI did:**

- Scaffolded **Next.js 16.4.6** (App Router, Turbopack, React 19.3, TypeScript) with **Tailwind CSS
  4.3.5** using pnpm. `pnpm audit` reported no known vulnerabilities.
- Added `motion` (the current package name for Framer Motion), `lenis` (smooth scroll), `clsx` +
  `tailwind-merge` (the `cn()` helper) and Prettier with Tailwind class sorting.
- Built a **three-tier token system** in `src/styles/tokens.css`:
  primitives (brand palette) → semantic roles (`surface`, `ink`, `accent`…) → motion (easings,
  durations). Removed Tailwind's default palette so only on-brand colours exist.
- Loaded all three fonts through `next/font/google` (self-hosted, no layout shift), including the
  Fraunces `SOFT`/`WONK`/`opsz` axes and the Shantell `BNCE`/`INFM` axes the original uses.
- Built a `Button` primitive, an original paw cursor SVG, a Lenis provider that respects
  `prefers-reduced-motion`, and a `/design-system` page that renders every token.
- Verified with a typecheck, lint, a production build and headless-Chrome screenshots. This caught one bug: Tailwind v4
  drops CSS variables that no class uses, so a few swatches were blank. Fixed with `@theme static`.

---

## Phase 2 — Layout shell

### Prompt 3 — Header, menu, footer and mobile bar

> Phase 2 is to build the layout shell. I've installed code-review-graph, which will give you
> structural knowledge of the code so far and of future updates to any file you need. I've also saved
> the reference site with an inspect tool, so you can extract the client-side code, media and images
> directly from it. My goal is to clone the site, taking some media assets from it directly, but the
> animated dog and similar illustrations we will design ourselves to add our own creativity. If you
> have any questions, ask me. Start Phase 2 and act like the senior SWE.
>
> _Follow-up:_ the saved resources are in `puppy.instabizweb.com/` inside the project folder.

**What the AI did:**

- Read the rendered markup and CSS of the saved header, mobile menu, footer and bottom bar to get the exact
  structure, spacing and behaviour, then **re-implemented it from scratch** (nothing copied from their bundles).
  Found that the saved `_next/image-*.html` files are really WebP photos with the wrong extension.
- Built the shell as a `(site)` route group: `SiteHeader`, `NavLink`, `MobileMenu`, `SiteFooter`, `WhatsAppBar`
  and a skip-to-content link.
  - **Header:** fixed; transparent over the hero on Home, solid on other pages; hides on scroll down and
    returns on scroll up or keyboard focus; scalloped hem; a paw stamps under the active page.
  - **Mobile menu:** native `<dialog>` (focus trap, Esc, top layer for free) that blooms out of the Menu
    button as a circle; staggered links; respects reduced motion.
  - **Footer:** `theme-cocoa` band that re-scopes the semantic tokens, rolling hill edge, twinkling stars and a
    CSS crescent moon. The Teddy-in-a-basket scene is left for Phase 5.
- Added stub pages for the six other routes so every link resolves and the active state can be tested.
- Replaced the reference site's WhatsApp prefill ("Hi Insta Biz Web, I'd like to discuss a project"), which
  looks like a template leftover, with a puppy-specific message.
- Tested in headless Chromium with a Playwright script: 26 checks (scroll hide/show, active link, menu open and
  close by button, Esc and link, scroll lock, no horizontal overflow, reduced motion, no console errors).
  **Bug caught:** the menu could get stuck open after Esc, because a `{ once: true }` `animationend` listener
  was consumed by a bubbling link animation. Fixed by removing the listener manually plus a timeout fallback.
- Excluded the reference-site snapshot from ESLint, Prettier, tsc and git.

---

## Phase 3 — Home page (in progress)

### Prompt 4 — Fix the code-review-graph build, start Phase 3, note the mascot's behaviour

> Before that, complete the MCP task. The code-review-graph build shouldn't take this long, so fix it.
> Then start Phase 3. Note that the puppy mascot is an animated sprite (or drawn): the centre one
> _[screenshot of the hero]_, and in the next section it walks across _[screenshots of the walking dog
> with paw prints]_ and flips direction depending on whether I scroll up or down. If you have any
> questions, ask me.

**What the AI did:**

- **Graph fix:** the first build was slow and polluted because it indexed the saved reference site's 4 MB of
  minified JS (1,226 nodes from 36 files). Added `.code-review-graphignore` (and the folder is in `.gitignore`)
  and rebuilt so the graph covers only our own source.
- **Data:** extracted all 15 puppies (name, details, photo focal point, tint colour, door colour) into a typed
  `src/data/puppies.ts`, and downloaded the original photos into `public/puppies/`.
- **Hero:** rebuilt the sky-and-sun hero, the six arched puppy photos peeking over a quilted ledge with a scalloped
  edge (desktop and phone placements), hover name tags, and Teddy, an original SVG poodle that blinks, twitches
  his ears and breathes. Geometry (seat positions, peek amounts, clamp sizes) taken from the reference CSS.
- **Found while building:** `priority` is deprecated on `next/image` in Next 16 (switched to `loading="eager"` +
  `fetchPriority="high"`); the quilt's decorative edge was swallowing hover/clicks on the arches (made it
  click-through); Teddy's entrance needed its own keyframe so it doesn't cancel his centring transform.
- **Understood the mascot:** "Meet the pups" is a pinned scroll section: scrolling moves a horizontal hall of
  doors while a walking Teddy flips direction with the scroll. This is the next piece to build.

### Prompt 5 — Make the mascot and the puppy cards behave like the original

> This is our puppy mascot _[screenshot of ours]_: it's slightly bigger, the head isn't proper, and it doesn't
> tilt its head like the small pup does, or say small dialogue like "hm". Also, around the puppy cards in the
> original site _[screenshots]_ the cards randomly go down, and when we hover currently they jump up. It should
> do that automatically with random cards. Check that out, it needs fixing. And when we scroll down slightly,
> the pups should hide _[screenshot]_. Random small dialogues will look appropriate. Follow the responsiveness.
> If you need a browser I can add you a Chrome extension to visit it.

**What the AI did:**

- **Watched the live site instead of guessing:** used a headless browser to log every state change over 50 s.
  Found the exact rhythm: a random seat ducks (0.34 s), its photo swaps to a puppy not on screen, it pops back
  (0.58 s) and shows its name tag for ~1.8 s; gaps repeat as 2.5 / 1.7 / 2.3 / 2.0 / 2.8 / 1.8 / 1.9 s. Teddy's only
  observed line was "hm?". Everything sinks behind the quilt once under half the hero is visible.
- **Redrew Teddy:** a wider, curlier head (ring of fur puffs, curl strokes, fluffy ears, topknot), ~10 % smaller to
  match the original, plus new parts: a head that tilts around the neck, a happy face with a tongue, a speech bubble.
- **Teddy's behaviour (my own design, since the original's head turn wasn't observable):** tilts his head every
  6–11 s, sometimes saying a short line ("hm?" most often); glances toward a pup that pops up; click/tap for a
  happy face and a "woof!". Pauses off-screen and with reduced motion.
- **Hero stage rebuilt as a client component** (`HeroStage`): the random duck → swap → pop cycle, never the same seat
  twice in a row and never two seats with the same photo, sink-on-scroll via IntersectionObserver, pause when the
  tab is hidden.
- 20 automated browser checks pass (cadence, seat variety, no duplicate photos, tilt, speech, click, scroll sink and
  return, reduced motion, phone overflow). The sink only triggers once the page is long enough to scroll past half
  the hero, which holds once the remaining home sections exist.

### Prompt 6 — Use the real browser and replicate every interaction

> _(After connecting the Claude in Chrome extension with `/chrome`.)_ Use Chrome: visit that site and move to
> the next phase. Check every interaction and animation and replicate it.

**What the AI did:**

- **Studied the original in a real browser** (scroll positions, DOM state, computed values) instead of guessing. Found:
  - The page is 14,035 px tall with 8 scenes; "Meet the pups" alone is 4,878 px of pinned scroll.
  - The stage is `position: sticky`; the track moves **1.25 px per scroll px**, ending at 4,816 px (track 6,670 px
    wide, doors 256 px, gaps 110 px at a 1,854 px viewport).
  - A door swings open once its centre crosses **48 % of the viewport width**; doors also open on hover/focus.
  - Teddy's side-view walk is **script-driven**, not CSS: separate SVG parts (body, 4 legs, tail, head, ear)
    transformed each frame; facing is a horizontal `scale(±1)` flip.
  - A fixed canvas draws fading paw prints along the mouse path.
- **Built "Meet the pups"** (`MeetThePups`): pinned sticky stage, scroll-driven track, wooden floor whose planks
  slide with the track, doors with a 3D-swinging leaf (peephole paw, knob, "Available" tag), a dashed
  "Meet them all" doorway, and a plain grid fallback for reduced motion.
- **Teddy walks** (`TeddyWalk`): own side-view drawing; scroll speed → stride length and cycle rate with a diagonal
  gait; scroll direction → which way he faces, easing through zero width so he turns instead of snapping.
- **Paw trail** (`PawTrail`): mouse only, stamps every 64 px alternating left/right of the path, redraws only while
  prints are visible.
- Compared against the original frame by frame in Chrome: section height, track width, max shift and door width
  match exactly. Fixed React-compiler lint errors (no ref callbacks or impure calls during render).

### Prompt 7 — One pup that walks the whole page

> _[Screenshot of the original: the pup has walked out of the hero and is crossing the "Meet the pups"
> heading, leaving paw prints.]_ What about the walking when we scroll down: it comes out of the hero and goes
> down. The original puppy is more detailed and more natural; ours is robotic. This pup walks to every section
> of the site; it's made like that. Check from the hero to the next section, take in-between screenshots, observe,
> and try to replicate how the original pup looks. We don't need to copy it fully, ours should be original, but
> it needs to be more natural in its build, walking and every interaction. Check in detail. Use code-review-graph.

**What the AI did:**

- **Reverse-engineered the mechanism in Chrome** by sampling the page every 100 px of scroll:
  - There is **one dog** in a fixed overlay (`pup-layer`) and nine invisible **stops** (hero peek, hall walk, five sits,
    a bow, a basket). Each section's own dog copy is hidden.
  - His position is a **stateless function of scroll**: hold at a stop, then travel to the next. x follows
    `smoothstep`, y follows `easeOutQuad`, scale eases out. All fitted to measurements, and his scale is
    `anchor width × 1.12 / 300` (the hero's 1.6128 matches exactly).
  - The look: frontal head, side-view body, poodle cuffs on the legs, pom tail, collar with a heart tag, shadow.
- **Built it:** `lib/pup/timeline.ts` (pure scroll → position), `lib/pup/rig.ts` (pure parameters → SVG transforms:
  diagonal gait, foot lift, body and head bob, ear lag, sit and peek poses), `TeddyActor` (the rig drawing),
  `TeddyHead` (one head shared by every pose), `PupProvider`/`PupStop`/`PupAnchor` (the stop registry and the frame loop).
  He now steps out of the hero, walks down the page shrinking, faces the way he moves, leaves **paw prints pinned to the
  page**, and settles on the hall's treadmill at (244, 770), scale 0.836 (original: 244, 772, 0.84).
- 10 unit tests for the timeline (`pnpm test`, Node's built-in runner), including one against the original's measured motion.

### Prompt 8 — Fix the code-review-graph build

> Kill the current graph fully and build it in a way that doesn't include the saved resources, node_modules, or
> anything like that.

**What the AI did:**

- **Root cause 1:** with no commits, `git ls-files` is empty, so the tool falls back to walking the whole directory
  (including `node_modules`, `.next` and the reference snapshot) before applying ignore rules. Fixed by staging the
  source (no commit) so git lists only real files: 73 tracked files, none from those folders.
- **Root cause 2 (the actual hang):** the tool's parallel parse workers deadlock inside the MCP server (all 8 stuck
  at 0 % CPU). Killed the stuck workers and built via the CLI with `CRG_SERIAL_PARSE=1`: **0.47 s** for 34 files, 97 nodes.
  Set the same variables in `.mcp.json` so server-side builds don't hang again.
- Used the graph to check the blast radius before replacing the old walker.

### Prompt 9 — Build the next sections, replicating each one

> OK, start making the new sections. Follow your earlier procedure to replicate them. Use code-review-graph.

**Procedure used for every section** (so it can be explained in the video): (1) read the original's markup and CSS from the saved
page; (2) open the live site in Chrome and sample its behaviour while scrolling; (3) fit the numbers; (4) build it with original
artwork; (5) measure the same elements on both sites and diff them; (6) check the graph for what a shared change could affect.

**Built so far (3 sections), each matching the original box for box:**

- **Two ways to meet your puppy:** signpost with two wooden arrows, showroom window + skyline, plane flying Korea → Dubai.
  The plane's position on its route is `t = (0.5·vh − sectionTop) / vh`, rotated to the curve's tangent (fits the original within 0.3 px).
- **Your puppy journey:** tall steps beside a sticky WhatsApp phone. A step arrives when its top passes 37.5 % of the viewport and triggers
  a typing indicator and a message (photos, video, route map). Triggers at the same scroll positions as the original.
- **Why families trust TeddyPups:** an open puppy passport; four ink stamps that thump in via CSS scroll-driven animations
  (no JavaScript), a sunset horizon with a setting sun.
- **Found along the way:** the original's headings use Fraunces at `opsz 144`, `WONK 1`, weight 800: a narrower display cut. Making that
  the default for h1–h3 fixed every title's width across the site. `text-huge` also scales as `6.4vw`, and `text-lede` is bigger than I had it.
- **Shared code change:** generalised Teddy's "pin" logic into a closed-form model of CSS `position: sticky`, so one rule covers the hall
  (sticky stage) and the journey (sticky phone). The graph showed 7 files import the pup layer (blast radius 30 files), so every stop was
  re-checked against the original: hall (246, 770) vs (244, 772), journey (1117, 654) vs (1117, 655).
- Fluffy poodle legs (a column of puffs) replaced the thin-stemmed legs that looked like sticks when sitting.

### Prompt 10 — Faster: many sections and pages at a time, exactly like the original

> OK, make the next sections from the original website. Make more and more sections at a time, and different pages too. Follow
> the original site's responsiveness exactly. Code cleanup will be later; for now it's fast development, but detailed: each and every
> thing detailed and looking like the original. Use code-review-graph. If any questions, ask me.

**Process change for speed:** download every page's rendered HTML once (22 pages), write a small analyzer that prints a page's markup
compactly, pull the CSS rules for each class prefix, build in bulk, then **diff element positions and sizes against the original in
Chrome** instead of eyeballing.

**Built this round (all numerically compared with the original):**

| Piece                                                                  | Result vs original                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Home, all 8 sections (hero → closing house)                            | every section's top and height identical; whole page 14,035 px, identical |
| Footer with Teddy peeking from a wicker basket                         | footer 13,330 / 705 px and basket box identical                           |
| `/happy-families` (64 taped polaroids + full-screen viewer)            | page height, title, note, 8,829 px wall, footer all identical             |
| `/faq` (cork board, pinned notes that unfold, live search)             | page height and board identical                                           |
| `/how-it-works` (tabbed switch, step cards, promise, delivery, why us) | every section identical, page height identical                            |

- **Assets:** 64 customer photos (4.2 MB) and the extra showroom photos + a 3 MB video, all copied locally.
- **New Teddy poses and behaviours:** play-bow (closing house), head tilt while wondering (questions), static figures on pages,
  a peeking copy in the basket. The page now records _which_ local stop he is parked at, so the hero ledge and the basket each show
  their own copy only while he is there.
- **Lesson worth explaining:** my component CSS is _unlayered_, so it beats Tailwind's layered utilities. `md:p-12` lost to a class rule
  until marked important (`md:p-12!`). Found by the numeric diff (a 40 px height gap), not by eye.
- Code-review-graph used to review the shared rig/actor/pup-layer changes: it lists exactly which files render Teddy.
- **Still to build:** `/contact` (fill-in-the-blank letter + envelope animation), `/gone-home` (cinema-style tickets), `/puppies`,
  `/puppies/[slug]`.

---

## Prompt 11 — `/puppies`, `/contact` and the page-change curtain

> Make https://puppy.instabizweb.com/puppies, then Visit and Contact. Also, when you move to a different page or start the site, there
> is a preloader (curtain-like, moves up). Check it and replicate it completely. Do not mess up the mobile responsiveness, and use
> code-review-graph to help.

**What I did**

- **Page curtain** (every page): a honey blanket with a diamond quilt and scalloped edges slides up, Teddy runs across it leaving paw
  prints, then it lifts. It plays once on first load (server-rendered, so there is no flash of the page) and on every internal link
  click. A small state machine (`intro → covering → covered → lifting → idle`) intercepts clicks at the document, so every link gets
  it without wiring; modified clicks, new tabs, same-page links and reduced motion pass straight through. Timings were read from the
  original: 0.3 s cover, 0.46 s lift. Measured here: covered at 309 ms, lifting at 765 ms, idle at 1228 ms.
- **`/puppies`**: "from Teddy's sketchbook". Filter pad of sticker chips (where / breed / boy or girl) that updates the URL without a
  navigation, and 15 "sketches": photo in a hand-wobbled blob, a pencil outline that draws itself on reveal, doodles, an "Available"
  sticker. Every second card sits lower. A strip of five puppies who have gone home sits below. Page height identical to the original (3,126 px).
- **`/contact`**: the enquiry is a fill-in-the-blank letter with a stamp. Validation (name, phone), a honey-pot field, then the
  letter folds into an envelope, drops into a post box, and a thank-you card offers the same message pre-filled in WhatsApp.
  Next to it: WhatsApp / call / email and the Downtown Dubai visit card.
- Checked at 390 px with Playwright: no horizontal overflow, no console errors.

---

## Prompt 12 — `/gone-home` and a page for every puppy, dynamic and reusable

> Make the gone-home page and the detail page for each pup. Make it dynamic, no hardcoding, a reusable page. Also use code-review-graph.

**What I did**

- **One data file, one template.** `src/data/pups.ts` holds a record per puppy (42: 15 available, 27 gone home): name, breed, gender, age,
  optional colour, where, and its photos/videos. `src/lib/pups.ts` works out everything a page says from that record (button labels,
  "what comes with…", the enquiry title, previous/next neighbours, meta description, ticket tilt/route). Add a puppy to the data file and
  its page, its ticket and its neighbours exist; no page hard-codes a puppy.
- **`/puppies/[slug]`**: one component (`PupStory`) for all 42, built ahead of time with `generateStaticParams`; unknown slugs are a real 404.
  The "storybook": reading ribbon down the left edge that grows as you scroll, a stacked-page photo frame, a swinging name tag with
  Teddy perched on it, a paper checklist, a paw-print trail for the way home (available puppies only) and a letter to the team.
  Gone-home puppies get a "Gone home ♥" badge, skip "the way home", and the enquiry becomes "Looking for a puppy like this?".
- **Gallery** works for 1 to 11 items: arrows and counter, thumbnails, videos play in the page, and a full-screen viewer. I made the
  existing `PhotoViewer` generic (it only needs `src`, `w`, `h`) so the happy wall and the puppy pages share it.
- **`/gone-home`**: a ticket booth with Teddy and an "admit one" cinema ticket for each of the 27 puppies, printing in one by one.
- **Checked against the original** with the same rect-diff method: `/gone-home` identical (page height 2,853); the detail page matched
  on every block for Max (available), Ace (gone), a 7-item gallery and a single-photo puppy, apart from one 16 px nav gap, then fixed.
- **Lesson repeated:** my unlayered `.pup-buddy { position: relative }` beat Tailwind's `absolute` and pushed the tag 121 px taller. Found by the diff, fixed with `absolute!`.

---

## Prompt 13 — Teddy's walk: ear, legs and top bun

> Focus on the pup when it walks: the left ear is not attached properly to the head, when it moves or twitches it swings out of place. The legs also look like separate pieces stuck over the body instead of connecting smoothly, and the top fur bun looks lumpy compared to the original. In the original site the body and limbs feel like one clean drawing. Check the SVG parts in the browser and fix these connection points so it moves naturally. Focus on this only, and use code-review-graph.

**What I found** (by rendering Teddy large in eight poses on a throwaway page, then on the live page):

- **Legs looked stuck on.** The near legs were drawn _over_ the body, so each leg's outline showed as a ring on the torso. Now all legs are drawn first and the torso over their tops, so they grow out from under the body's lower edge. Legs are slimmer and a little shorter, with a clearer lift as the paw swings forward. While sitting, the near legs are drawn in front instead (same two legs drawn twice, cross-faded by the sit amount).
- **Ears were not attached.** They pivoted about the outer top of the ear, so the bottom swung out of the head by up to 20° (walk sway plus the random twitch). Each ear is now a chain of puffs that starts well inside the head and swings about a point inside the head, ±4° while walking and ±5° on a twitch, so its root never shows.
- **The bun was three lumpy puffs merged into the head.** It is now one round tuft drawn behind the head, so the head's outline crosses its base.
- Code-review-graph showed the rig files affect 58 files (every page that draws Teddy), so every pose was checked: stand, four walk phases, sit, bow, facing left, and on the live page mid-scroll.

---

## Prompt 14 — Seated back leg and a frame-by-frame gait comparison

> Do both: refine the seated back leg, and compare the walk frame by frame with the original. Also use code-review-graph.

**Gait comparison.** I sampled every transform of the original's travelling pup and mine, every animation frame, while scrolling at three controlled speeds (3, 6, 12 px per frame). What the numbers showed:

- **The original's gait is driven by distance, not time.** It completes one leg cycle per ~80 px of scroll at any speed (81.6, 78.4, 67.2 px), so the paws stay planted. Mine ran on a clock (a 0.7–1.2 s cycle whatever the scroll speed), so the feet skated.
- **My paw lift was backwards.** The paw rose while the leg pushed back, and dragged while it swung forward.
- Leg angles in the original span about −30° to +35° with a forward swing that folds further; mine was a plain ±20° pendulum.

**What I changed**

- A ground-contact cycle (`legCycle`): the paw slides back at an even pace while planted, then lifts, folds a little and swings forward ahead of the body.
- The loop now advances the gait by how far he travelled (`STRIDE_UNITS = 140`), so stride follows the page. Result: 71.6 / 78.9 / 82.2 px per stride against the original's 81.6 / 78.4 / 67.2, with angle range −29°…+26° against −30°…+35°.
- **Seated pose:** the near hind leg is replaced by a rounded thigh with the foot tucked forward along the ground, like the original's own `haunch` part, instead of a folded tube.
- 6 new unit tests for the gait (no jumps in the angle, lift only on the forward swing, even ground pace, diagonal pairing, straight legs when still, stride in proportion).

---

## Prompt 15 — Legs, eyes that follow the cursor, blushing, and a proper phone version

> The legs still have an outline line cutting through central part, let's blend that in so the legs look like they naturally come out of the body. Also noticed two things on the original: the eyes track the cursor wherever it moves, and when you click the face it blushes pink and blinks. Let's add that. And check the mobile view carefully: right now you just shrank the desktop layout, but the original actually changes it. On phone, the doors aren't a horizontal sliding hallway, they're a 2-column vertical grid, and the pup parks in the bottom corner next to the WhatsApp bar in each section. Fix the legs first, then replicate that mobile layout properly. Use code-review-graph.

**Legs.** The torso's outline still ran across the top of each leg. Each leg now has a small body-coloured "hip patch" drawn over that outline, so the body line stops at the leg and the leg flows out of it (no dark spot, since the patch is always body-coloured).

**Eyes and blush.** `EyeTracker` (one small client component) slides every Teddy's eyes up to 5 × 3.4 drawing units toward the pointer and eases them back when it leaves; it handles a mirrored (left-facing) Teddy. Tapping or clicking a face (not a link or button over it) sets `data-blush`: cheeks swell to a deeper pink, eyes shut, then reopen with extra sparkle highlights, all in CSS over 2.4 s.

**Phones: I had only made the page responsive, not replicated the original.** I loaded the original at 390 px and recorded it (every 120 scroll px, plus section tops):

- **Teddy has a separate phone mode.** After the hero he is 60 % size and moves to the bottom of the screen, tucked behind the CTA bar; he sits in one corner for a whole section, walks across when the next section begins to appear (next section's top about 87 % down the screen) and sits in the opposite corner (arrives when it is about 16 % down), alternating left / right. I built the same as "lane" stops in `pup-layer.tsx` (sections opt in with `data-pup-lane`). Measured: left corner x −72, y 677; right corner x 205, facing left, the same as the original.
- **"Meet the pups" is a two-column grid of doors on phones**, each swinging open as it scrolls into view; the horizontal sliding hall is md and up only (matching the original). Section height 3,121 px, identical.
- **Every other section height now matches too.** My teddy anchor boxes took up room on phones (paths +165, chat +88, passport +118 px); they are now hidden there. The whole home page is 13,039 px on a phone, identical to the original, and every section top matches.
- **Hero pup is about a tenth smaller on phones** (eye span 40 px against my 44).

---

## Prompt 16 — Corner peek (not a sit), head proportions, and the phone pages

> It does not sit sideways, like the hero section it is hidden in the boundary; everywhere it reaches it does that. Should I do the same phone comparison for the other pages? Then test the puppies page too.

**What the original really does in the phone corners.** I read the original's rig at a corner: the body has opacity 0 and only the head, the "ledge" paws and a nose-to-bar peek remain. So he does not sit; he **peeks over the CTA bar** exactly like in the hero, face on. The corner stops now use the peek pose.

**Head proportions.** Measured against the original at the same scale (head box 78 × 78, eye span 30 px; mine 98 × 76 and 35 px). The head silhouette was wider than tall because my ears stuck out. Zooming the two side by side showed the original's ears sit _behind_ the head and show only at its lower sides, its top-knot is a wide scalloped puff, its eyes are bigger and closer with larger highlights, its cheeks sit further out and there are no curl strokes. I redrew the head to match (rounder, taller cloud), set `HEAD_SCALE` to 0.6, and retuned the hero peek size and height for phone and desktop so the hand-over to the walking Teddy stays seamless.

**Phone comparison of the other pages** (390 px, element rects against the original):

- `/puppies`: pixel-identical (header, every chip, every card, the gone-home strip, footer; page height 5,685 px).
- `/puppies/[slug]`: identical on every block for three puppies; the prev/next cards had a 4 px gap difference on every page (fixed). My gone-home enquiry text was invented; the original uses the same paragraph and the message "Hi! I'd love to know more about Ace (Pomeranian)." (fixed, the 27 px height gap is gone).
- One puppy with a long name wraps one line differently and is 1 px off.

**A real bug found by the sweep.** `/puppies` reported a hydration mismatch on wide screens: `RevealScope` marked the cards `data-armed` before the Suspense boundary I had around the filter board had hydrated. I removed the Suspense (the URL filters are now read with `useSyncExternalStore`, empty on the server) and made the eye tracker leave eyes alone until there is a pointer. Eight pages × desktop/tablet/phone × 3 runs: no console errors, warnings or overflow.

---

## Prompt 17 — Teddy floating above the bar on phones

> On mobile, the pup is floating in the air instead of resting on the bottom bar. It needs to sit right on top of that horizontal line with its paws touching the edge. Check the height offset and the scroll stop timing so it stays planted on the bar properly. Check both desktop and phone.

**Cause.** In a phone corner he rests with only his head and paws showing, so his paws should touch the top edge of the CTA bar. Two things made him float: my "drop from walking height onto the bar" took 140 scroll px after he arrived (so at many stops he was still hovering about 40 px up), and even once settled his paws were 8 px above the edge (the original's are 2 px).

**Fix.** Parked, he always rests on the bar's edge (paws within 2 px of it; measured at 52 scroll positions on two phone heights, 844 and 667 px). While crossing between corners he leaves the edge, walks with his feet on the bar's top line, and lands again (a short smoothstep at each end of the walk, done in the loop). Walking height raised so his feet no longer dip behind the bar. Compared frame by frame with the original at five scroll positions through a walk.

---

## Prompt 18 — The curtain on phone menu taps (and more like the original)

> On mobile, tapping a menu link or changing page does not show the preloader, and I have to tap Close after the page changes. Add the transition there, observe the real one carefully and replicate it a bit more.

**Cause.** The mobile menu is a native modal `<dialog>`, which lives in the browser's top layer, above everything. My curtain catches link clicks at the document and stops them, so the menu link's own handler, the thing that closes the menu, never ran. The menu stayed open on top, the curtain slid up _behind_ it, and the page changed unseen.

**Fix.** When the tapped link is inside an open dialog, the curtain closes it first, exactly as the original does (it is shut within 5 ms of the tap). Recording both sites on a touch phone, tap to finish: original covering at 100 ms / covered 407 / lifting 550 / idle 1000; mine 101 / 402 / 573 / 1050. I had held the cover about 300 ms longer than the original, so the minimum cover time dropped from 760 to 450 ms.

**A bug found on the way.** After navigating, Next keeps the previous page mounted but hidden, so its Teddy stops stayed registered and the roaming Teddy kept standing at the old page's position on the new page (visible at the bottom-left of /faq on phones). Stops whose elements are hidden are now ignored. Checked on phone and desktop: he hides on pages with no stops and comes back when you return.

**Runner redrawn to match the original's more closely** (compared frame by frame, zoomed): a larger head with a centred face and pink cheeks, a tail pom on a stem, a collar with a heart tag, shorter stubby legs.

---

## Prompt 19 — Moving to code quality: fallow baseline

> That is enough for the visual design and mobile layout for now. Moving on to code quality and the work done so far. I have a tool to help: install `npx fallow` and paste the report in a file, for your memory, for fast review of the codebase. Use code-review-graph.

Ran `npx --yes fallow` (v3.45.0, nothing added to `package.json`): dead code, duplication and health together, plus the architecture check. Wrote everything to `FALLOW-REPORT.md`: the raw output, a triage of what is real, a cross-check from code-review-graph (largest files and functions, hub nodes, untested hotspots) and a suggested cleanup order. Added `/.fallow/` (the tool's cache) to `.gitignore`. No code was changed.

Headline: 0 circular dependencies, architecture clean, maintainability 92.7 / 100, duplication 0.7 %, dead code 6.8 % of exports (1 file, 8 exports, 2 types, 1 dev dependency). The one real refactor target, by both fallow and the graph, is `pup-layer.tsx` (`tick`, cyclomatic 40).

---

## Prompt 20 — Start the cleanup, committing in sequence

> Yes, start the cleanup, and start by committing in sequence.

Committed the whole project as eight commits in build order: scaffold; design system; layout; mascot; home; pages; interactions; docs. The tool folders (`.claude`, `.gemini`, `.github`, `.vscode`, `.mcp.json`) are left out.

Cleanup step 1 (quick wins from `FALLOW-REPORT.md`): deleted the unused `page-stub.tsx`; stopped exporting the symbols only used inside their own files. Fallow's "unused" dev dependency `@tailwindcss/turbopack` is a **false positive**: `next.config.ts` uses it by name as the Turbopack CSS loader, so it stays and is recorded in `.fallowrc.jsonc` with the reason. Dead code is now 0.

Cleanup step 2: split Teddy's animation loop. The motion rules (pace from movement, easing of the rig towards its goal, the phone lane's walking height, the paw-print rule) now live in pure `lib/pup/motion.ts` with 8 unit tests. `tick` went from cyclomatic 40 to 12. Checked by running the old and new loop side by side: identical positions at 13 scroll points on a phone and identical gait range, so behaviour is unchanged.
