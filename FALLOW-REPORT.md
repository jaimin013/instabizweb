# Fallow report: code-quality baseline

> Written so the next session (me, or anyone) can pick up code-quality work fast. It holds the **raw fallow
> output**, a **triage of what is real vs noise**, a **cross-check from code-review-graph**, and a **suggested
> cleanup order**. Nothing in this report has been fixed yet: it is the baseline to improve against.

|                |                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Generated      | 2026-11-21, after the contact / puppies / puppy-detail / gone-home pages, the page curtain and the phone Teddy lane |
| Tool           | `fallow` 3.45.0 via `npx --yes fallow` (nothing added to `package.json`)                                            |
| Scope          | 93 source files, 448 functions, 15,654 LOC (TypeScript, TSX and CSS), zero-config defaults                          |
| Status of repo | no commits yet, so fallow **skipped hotspot (churn) analysis**                                                      |

## Cleanup progress

| Step | What                                                                                                                                                                                                                        | Result                                                                                                                                                                                                                                                                                                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Deleted `page-stub.tsx`; stopped exporting 8 exports / 2 types used only inside their own files                                                                                                                             | Dead code **0** (fallow dead-code: "no issues found"). Typecheck, lint, 16 tests and the build pass.                                                                                                                                                                                                            |
| 1    | `@tailwindcss/turbopack` flagged as unused: **false positive, kept**                                                                                                                                                        | `next.config.ts` names it as a Turbopack CSS loader (a string fallow cannot follow). Now listed in `.fallowrc.jsonc` with the reason.                                                                                                                                                                           |
| 2    | `pup-layer.tsx`: moved Teddy's motion rules into pure `lib/pup/motion.ts` (`travelPace`, `treadmillPace`, `easeRig`, `laneWalkY`, `shouldPrint`) and split the loop into `buildStops` / `heightFor` / `measure` / `drawRig` | `tick`: cyclomatic **40 → 12**, cognitive **44 → 8**, 107 → 45 lines. New: `measure` (cyc 11, DOM-bound closure, still untested). 8 new unit tests (24 total). Behaviour A/B-tested against the old code: identical phone positions at 13 scroll points, identical gait range. Maintainability avg 92.7 → 93.1. |

The "Raw output" below is the **original baseline** (before step 1); it is kept as a record to compare against.

## Re-run it

```bash
npx fallow --format markdown                    # dead code + duplication + health together (this report's main section)
npx fallow architecture --format markdown       # import cycles / boundary rules
npx fallow dead-code --trace <file>:<export>    # prove an export really is unused before deleting it
npx fallow health --targets                     # ranked refactoring targets
npx fallow audit --base <ref>                   # review only what changed (use before a commit / PR)
npx fallow doctor                               # readiness check
```

Exit code 1 only means "findings exist" (the complexity and error-severity gates). The `.fallow/` cache folder is git-ignored.

## At a glance

| Area                  | Result                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------- |
| Circular dependencies | **0**                                                                                  |
| Architecture rules    | **no issues**                                                                          |
| Maintainability       | **92.7 / 100** average (lowest: `how-it-works.tsx` 79.9, `pups.ts` 80.5)               |
| Cyclomatic            | average **1.9**, P90 **3** (healthy), but **32 functions** over the thresholds         |
| Duplication           | **0.7%** (110 lines, 6 clone groups); about half of it is CSS                          |
| Dead code             | 1 file, 8 exports, 2 type exports, 1 dev dependency (**6.8%** of exports)              |
| Tests                 | 16 unit tests, all on `lib/pup/timeline.ts` and `lib/pup/rig.ts`; nothing else covered |

## Raw output

## Fallow: 12 issues found

### Unused files (1)

- `src/components/ui/page-stub.tsx`

### Unused exports (8)

- `src/components/pages/how-it-works.tsx`
  - :138 `Journeys`
  - :331 `HowTail`
- `src/lib/fonts.ts`
  - :13 `figtree`
  - :20 `fraunces`
  - :28 `shantell`
- `src/lib/pup/timeline.ts`
  - :35 `lerp`
- `src/lib/pups.ts`
  - :11 `availablePups`
  - :27 `subject`

### Unused type exports (2)

- `src/components/ui/button.tsx`
  - :22 `ButtonVariant`
- `src/lib/pup/rig.ts`
  - :36 `LegName`

### Unused devDependencies (1)

- `@tailwindcss/turbopack`

## Fallow: 6 clone groups found (0.7% duplication)

### Duplicates

**Clone group 1** (8 lines, 3 instances)

- `src/styles/how.css:36-42`
- `src/styles/passport.css:34-41`
- `src/styles/story.css:216-222`

**Clone group 2** (14 lines, 2 instances)

- `src/styles/how.css:34-45`
- `src/styles/story.css:214-227`

**Clone group 3** (10 lines, 2 instances)

- `src/components/sections/journey-chat.tsx:184-193`
- `src/components/sections/two-ways.tsx:79-88`

**Clone group 4** (7 lines, 2 instances)

- `src/components/icons/paw.tsx:6-12`
- `src/components/pages/happy-wall.tsx:79-85`

**Clone group 5** (12 lines, 2 instances)

- `src/components/pages/how-it-works.tsx:385-394`
- `src/components/sections/two-ways.tsx:156-167`

**Clone group 6** (10 lines, 2 instances)

- `src/styles/how.css:17-26`
- `src/styles/story.css:96-105`

### Clone Families

**Family 1** (1 group, 7 lines across `src/components/icons/paw.tsx`, `src/components/pages/happy-wall.tsx`)

- Extract shared function (7 lines) from paw.tsx, happy-wall.tsx (~7 lines saved)

**Family 2** (1 group, 12 lines across `src/components/pages/how-it-works.tsx`, `src/components/sections/two-ways.tsx`)

- Extract shared function (12 lines) from how-it-works.tsx, two-ways.tsx (~12 lines saved)

**Family 3** (1 group, 10 lines across `src/components/sections/journey-chat.tsx`, `src/components/sections/two-ways.tsx`)

- Extract shared function (10 lines) from journey-chat.tsx, two-ways.tsx (~10 lines saved)

**Family 4** (1 group, 8 lines across `src/styles/how.css`, `src/styles/passport.css`, `src/styles/story.css`)

- Extract shared function (8 lines) from how.css, passport.css, story.css (~16 lines saved)

**Family 5** (2 groups, 24 lines across `src/styles/how.css`, `src/styles/story.css`)

- Extract shared function (14 lines) from how.css, story.css (~14 lines saved)
- Extract shared function (10 lines) from how.css, story.css (~10 lines saved)

**Summary:** 110 duplicated lines (0.7%) across 8 files

## Vital Signs

| Metric                                       |                                          Value |
| :------------------------------------------- | ---------------------------------------------: |
| Total LOC                                    |                                          15654 |
| Avg Cyclomatic                               |                                            1.9 |
| P90 Cyclomatic                               |                                              3 |
| Cyclomatic units                             | Functions: 448, module scopes: 1, templates: 0 |
| Module-scope max cyclomatic (aggregate only) |                                              3 |
| Dead Files                                   |                                           1.1% |
| Dead Exports                                 |                                           6.8% |
| Maintainability (avg)                        |                                           92.7 |
| Hotspots                                     |                                              0 |
| Circular Deps                                |                                              0 |
| Unused Deps                                  |                                              1 |

## Fallow: 32 high complexity functions

| File                                           | Function        | Severity | Cyclomatic | Cognitive | CRAP         | Lines |
| :--------------------------------------------- | :-------------- | :------- | :--------- | :-------- | :----------- | :---- |
| `src/components/pup/pup-layer.tsx:244`         | `tick`          | critical | 40 **!**   | 44 **!**  | 1640.0 **!** | 107   |
| `src/components/effects/eye-tracker.tsx:39`    | `update`        | critical | 15         | 20 **!**  | 240.0 **!**  | 34    |
| `src/components/layout/page-curtain.tsx:70`    | `wantsCurtain`  | critical | 14         | 10        | 210.0 **!**  | 11    |
| `src/lib/pups.ts:29`                           | `pupCopy`       | critical | 14         | 15        | 210.0 **!**  | 43    |
| `src/components/pup/pup-layer.tsx:76`          | `resolve`       | critical | 11         | 10        | 132.0 **!**  | 62    |
| `src/components/pup-page/pup-gallery.tsx:16`   | `PupGallery`    | high     | 9          | 14        | 90.0 **!**   | 128   |
| `src/components/pup-page/enquiry-form.tsx:43`  | `submit`        | high     | 8          | 7         | 72.0 **!**   | 15    |
| `src/components/pages/faq-board.tsx:20`        | `FaqBoard`      | high     | 7          | 9         | 56.0 **!**   | 110   |
| `src/components/pup-page/enquiry-form.tsx:18`  | `EnquiryForm`   | high     | 7          | 17 **!**  | 56.0 **!**   | 165   |
| `src/components/effects/paw-trail.tsx:77`      | `draw`          | moderate | 6          | 7         | 42.0 **!**   | 16    |
| `src/components/gallery/photo-viewer.tsx:36`   | `PhotoViewer`   | moderate | 6          | 8         | 42.0 **!**   | 97    |
| `src/components/gallery/photo-viewer.tsx:47`   | `<arrow>`       | moderate | 6          | 5         | 42.0 **!**   | 12    |
| `src/components/gallery/sketch.tsx:122`        | `Sketch`        | moderate | 6          | 17 **!**  | 42.0 **!**   | 79    |
| `src/components/pages/puppies-board.tsx:83`    | `<arrow>`       | moderate | 6          | 4         | 42.0 **!**   | 4     |
| `src/components/pup-page/pup-story.tsx:75`     | `PupStory`      | moderate | 6          | 5         | 42.0 **!**   | 168   |
| `src/hooks/use-header-visibility.ts:28`        | `<arrow>`       | moderate | 6          | 5         | 42.0 **!**   | 7     |
| `src/components/effects/eye-tracker.tsx:87`    | `onDown`        | moderate | 5          | 4         | 30.0 **!**   | 26    |
| `src/components/effects/paw-trail.tsx:59`      | `<arrow>`       | moderate | 5          | 4         | 30.0 **!**   | 82    |
| `src/components/gallery/polaroid.tsx:10`       | `Polaroid`      | moderate | 5          | 11        | 30.0 **!**   | 55    |
| `src/components/gallery/sketch.tsx:44`         | `Doodle`        | moderate | 5          | 1         | 30.0 **!**   | 57    |
| `src/components/layout/mobile-menu.tsx:29`     | `closeMenu`     | moderate | 5          | 3         | 30.0 **!**   | 23    |
| `src/components/layout/page-curtain.tsx:114`   | `onClick`       | moderate | 5          | 3         | 30.0 **!**   | 26    |
| `src/components/pages/contact-letter.tsx:31`   | `problems`      | moderate | 5          | 4         | 30.0 **!**   | 9     |
| `src/components/pages/contact-letter.tsx:121`  | `ContactLetter` | moderate | 5          | 15        | 30.0 **!**   | 215   |
| `src/components/pages/contact-letter.tsx:145`  | `submit`        | moderate | 5          | 5         | 30.0 **!**   | 20    |
| `src/components/pages/puppies-board.tsx:57`    | `useFilters`    | moderate | 5          | 5         | 30.0 **!**   | 17    |
| `src/components/pages/puppies-board.tsx:75`    | `Board`         | moderate | 5          | 9         | 30.0 **!**   | 88    |
| `src/components/pup/pup-layer.tsx:166`         | `<arrow>`       | moderate | 5          | 4         | 30.0 **!**   | 22    |
| `src/components/sections/hero-stage.tsx:146`   | `<arrow>`       | moderate | 5          | 4         | 30.0 **!**   | 42    |
| `src/components/sections/journey-chat.tsx:156` | `update`        | moderate | 5          | 4         | 30.0 **!**   | 27    |
| `src/components/sections/meet-the-pups.tsx:53` | `<arrow>`       | moderate | 5          | 3         | 30.0 **!**   | 57    |
| `src/components/sections/hero-stage.tsx:44`    | `HeroStage`     | moderate | 4          | 18 **!**  | -            | 168   |

**!** marks the dimension that breached.

**93** files, **448** functions analyzed (thresholds: cyclomatic > 20, cognitive > 15, CRAP >= 30.0)

### File Health Scores (66 files)

| File                                          | Maintainability | Fan-in | Fan-out | Dead Code | Density | Risk   |
| :-------------------------------------------- | :-------------- | :----- | :------ | :-------- | :------ | :----- |
| `src/components/pup/pup-layer.tsx`            | 87.3            | 10     | 4       | 0%        | 0.21    | 1640.0 |
| `src/components/effects/eye-tracker.tsx`      | 91.6            | 1      | 0       | 0%        | 0.28    | 240.0  |
| `src/lib/pups.ts`                             | 80.5            | 4      | 2       | 29%       | 0.31    | 210.0  |
| `src/components/layout/page-curtain.tsx`      | 87.9            | 1      | 3       | 0%        | 0.22    | 210.0  |
| `src/components/pup-page/pup-gallery.tsx`     | 88.5            | 1      | 4       | 0%        | 0.17    | 90.0   |
| `src/components/pup-page/enquiry-form.tsx`    | 91.7            | 1      | 2       | 0%        | 0.13    | 72.0   |
| `src/components/pages/faq-board.tsx`          | 88.0            | 1      | 5       | 0%        | 0.16    | 56.0   |
| `src/components/pages/puppies-board.tsx`      | 87.1            | 1      | 6       | 0%        | 0.17    | 42.0   |
| `src/components/pup-page/pup-story.tsx`       | 88.9            | 1      | 10      | 0%        | 0.05    | 42.0   |
| `src/hooks/use-header-visibility.ts`          | 90.4            | 1      | 0       | 0%        | 0.32    | 42.0   |
| `src/components/effects/paw-trail.tsx`        | 92.1            | 1      | 1       | 0%        | 0.17    | 42.0   |
| `src/components/gallery/photo-viewer.tsx`     | 92.5            | 3      | 0       | 0%        | 0.25    | 42.0   |
| `src/components/gallery/sketch.tsx`           | 97.0            | 1      | 0       | 0%        | 0.10    | 42.0   |
| `src/components/sections/hero-stage.tsx`      | 87.3            | 1      | 4       | 0%        | 0.21    | 30.0   |
| `src/components/pages/contact-letter.tsx`     | 88.9            | 1      | 5       | 0%        | 0.13    | 30.0   |
| `src/components/layout/mobile-menu.tsx`       | 89.4            | 1      | 3       | 0%        | 0.17    | 30.0   |
| `src/components/sections/meet-the-pups.tsx`   | 90.0            | 1      | 4       | 0%        | 0.12    | 30.0   |
| `src/components/sections/journey-chat.tsx`    | 90.6            | 1      | 4       | 0%        | 0.10    | 30.0   |
| `src/components/gallery/polaroid.tsx`         | 94.5            | 2      | 1       | 0%        | 0.09    | 30.0   |
| `src/components/sections/two-ways.tsx`        | 92.4            | 1      | 3       | 0%        | 0.07    | 20.0   |
| `src/lib/pup/timeline.test.ts`                | 88.8            | 0      | 1       | 0%        | 0.28    | 13.8   |
| `src/components/pages/how-it-works.tsx`       | 79.9            | 1      | 3       | 67%       | 0.04    | 12.0   |
| `src/components/sections/families-street.tsx` | 90.4            | 1      | 6       | 0%        | 0.06    | 12.0   |
| `src/hooks/use-teddy.ts`                      | 92.5            | 1      | 0       | 0%        | 0.25    | 12.0   |
| `src/components/ui/reveal-scope.tsx`          | 92.7            | 6      | 0       | 0%        | 0.27    | 12.0   |
| `src/components/pup-page/tag-buddy.tsx`       | 93.0            | 2      | 1       | 0%        | 0.17    | 12.0   |
| `src/components/pup-page/story-ribbon.tsx`    | 94.6            | 1      | 0       | 0%        | 0.20    | 12.0   |
| `src/components/ui/button.tsx`                | 94.9            | 20     | 1       | 0%        | 0.09    | 12.0   |
| `src/lib/site.ts`                             | 96.7            | 16     | 0       | 0%        | 0.11    | 12.0   |
| `src/components/mascot/fur.tsx`               | 97.3            | 3      | 0       | 0%        | 0.09    | 12.0   |
| `src/components/ui/page-stub.tsx`             | 76.7            | 0      | 1       | 100%      | 0.06    | 2.0    |
| `src/lib/pup/rig.ts`                          | 97.9            | 3      | 0       | 0%        | 0.07    | 7.5    |
| `src/lib/pup/timeline.ts`                     | 91.2            | 2      | 0       | 17%       | 0.18    | 6.1    |
| `src/app/(site)/puppies/%5Bslug%5D/page.tsx`  | 90.1            | 0      | 3       | 0%        | 0.18    | 6.0    |
| `src/components/pages/happy-wall.tsx`         | 91.6            | 1      | 5       | 0%        | 0.04    | 6.0    |
| `src/components/sections/closing-house.tsx`   | 92.7            | 1      | 4       | 0%        | 0.03    | 6.0    |
| `src/components/mascot/teddy-actor.tsx`       | 93.9            | 8      | 3       | 0%        | 0.02    | 6.0    |
| `src/components/layout/nav-link.tsx`          | 96.0            | 1      | 1       | 0%        | 0.10    | 6.0    |
| `src/components/mascot/teddy-runner.tsx`      | 96.0            | 1      | 1       | 0%        | 0.04    | 6.0    |
| `src/components/providers/smooth-scroll.tsx`  | 98.8            | 1      | 0       | 0%        | 0.09    | 6.0    |
| `src/lib/pup/rig.test.ts`                     | 87.0            | 0      | 1       | 0%        | 0.34    | 4.9    |
| `src/app/(site)/page.tsx`                     | 90.2            | 0      | 9       | 0%        | 0.04    | 2.0    |
| `src/app/(site)/layout.tsx`                   | 91.1            | 0      | 7       | 0%        | 0.03    | 2.0    |
| `src/components/pages/gone-tickets.tsx`       | 91.9            | 1      | 5       | 0%        | 0.03    | 2.0    |
| `src/components/layout/site-header.tsx`       | 92.2            | 1      | 5       | 0%        | 0.02    | 2.0    |
| `src/app/layout.tsx`                          | 92.9            | 0      | 4       | 0%        | 0.03    | 2.0    |
| `src/components/sections/hero.tsx`            | 93.3            | 1      | 4       | 0%        | 0.01    | 2.0    |
| `src/components/sections/questions-night.tsx` | 93.3            | 1      | 3       | 0%        | 0.04    | 2.0    |
| `src/app/(site)/contact/page.tsx`             | 94.2            | 0      | 3       | 0%        | 0.01    | 2.0    |
| `src/components/layout/site-footer.tsx`       | 94.7            | 1      | 2       | 0%        | 0.03    | 2.0    |
| `src/app/(site)/gone-home/page.tsx`           | 95.0            | 0      | 2       | 0%        | 0.06    | 2.0    |
| `src/components/layout/whatsapp-bar.tsx`      | 95.0            | 1      | 2       | 0%        | 0.04    | 2.0    |
| `src/components/layout/footer-basket.tsx`     | 95.1            | 1      | 2       | 0%        | 0.02    | 2.0    |
| `src/app/(site)/design-system/page.tsx`       | 96.0            | 0      | 1       | 0%        | 0.04    | 2.0    |
| `src/components/sections/trust-passport.tsx`  | 96.3            | 1      | 1       | 0%        | 0.03    | 2.0    |
| `src/components/mascot/teddy-peek.tsx`        | 96.5            | 2      | 1       | 0%        | 0.03    | 2.0    |
| `src/app/(site)/faq/page.tsx`                 | 96.6            | 0      | 1       | 0%        | 0.04    | 2.0    |
| `src/app/(site)/how-it-works/page.tsx`        | 96.6            | 0      | 1       | 0%        | 0.08    | 2.0    |
| `src/app/(site)/puppies/page.tsx`             | 96.6            | 0      | 1       | 0%        | 0.08    | 2.0    |
| `src/components/mascot/teddy-head.tsx`        | 96.6            | 2      | 1       | 0%        | 0.02    | 2.0    |
| `src/app/(site)/happy-families/page.tsx`      | 96.7            | 0      | 1       | 0%        | 0.08    | 2.0    |
| `src/lib/pup/prints.ts`                       | 97.6            | 2      | 0       | 0%        | 0.12    | 2.0    |
| `src/lib/cn.ts`                               | 99.3            | 2      | 0       | 0%        | 0.05    | 2.0    |
| `src/components/icons/paw.tsx`                | 99.4            | 7      | 0       | 0%        | 0.07    | 2.0    |
| `src/data/puppies.ts`                         | 99.7            | 7      | 0       | 0%        | 0.01    | 2.0    |
| `src/data/wall.ts`                            | 100.0           | 3      | 0       | 0%        | 0.00    | 2.0    |

**Average maintainability index:** 92.7/100

### Refactoring Targets (3)

| Efficiency | Category    | Effort / Confidence | File                                    | Recommendation                                                      |
| :--------- | :---------- | :------------------ | :-------------------------------------- | :------------------------------------------------------------------ |
| 12.6       | high impact | medium / medium     | `src/lib/pups.ts`                       | Split high-impact file (83 LOC), 4 dependents amplify every change  |
| 8.8        | complexity  | high / high         | `src/components/pup/pup-layer.tsx`      | Extract tick (cognitive: 44) in 404-LOC file into smaller functions |
| 6.7        | dead code   | high / high         | `src/components/pages/how-it-works.tsx` | Remove 2 unused exports to reduce surface area (67% dead)           |

---

<details><summary>Metric definitions</summary>

- **MI**: Maintainability Index (0–100, higher is better)
- **Order**: risk-aware triage order using the larger of low-MI concern and CRAP risk
- **Fan-in**: files that import this file (blast radius)
- **Fan-out**: files this file imports (coupling)
- **Dead Code**: % of value exports with zero references
- **Density**: cyclomatic complexity / lines of code
- **Risk**: max CRAP score for the file; low <15, moderate 15-30, high >=30
- **Efficiency**: priority / effort (higher = better quick-win value, default sort)
- **Category**: recommendation type (churn+complexity, high impact, dead code, complexity, coupling, circular dep)
- **Effort**: estimated effort (low / medium / high) based on file size, function count, and fan-in
- **Confidence**: recommendation reliability (high = deterministic analysis, medium = heuristic, low = git-dependent)

[Full metric reference](https://fallow.tools/docs/explanations/health/)

</details>

### `fallow architecture`

```
Fallow: no issues found
```

## Triage: what is real

CRAP scores are **pessimistic here**: no coverage data was supplied, so CRAP is roughly cyclomatic² + cyclomatic.
The only real tests are the 16 on `timeline`/`rig`. That is why `tick` shows 1640. Treat CRAP as "untested and
branchy", not as an exact number.

### Dead code (all safe to act on, but confirm each with `fallow dead-code --trace`)

| Finding                                                    | My read                                                                                                           | Action              |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------- |
| `src/components/ui/page-stub.tsx` unused file              | Real. Every route is now built; the stub is a leftover from phase 3.                                              | **Delete**          |
| `how-it-works.tsx` `Journeys`, `HowTail`                   | Real: only used inside the same file.                                                                             | Stop exporting      |
| `lib/fonts.ts` `figtree`, `fraunces`, `shantell`           | Used inside the file to build `fontVariables`; nobody imports them.                                               | Stop exporting      |
| `timeline.ts` `lerp`; `pups.ts` `availablePups`, `subject` | Used inside their own files.                                                                                      | Stop exporting      |
| types `ButtonVariant` (button.tsx), `LegName` (rig.ts)     | Used inside their own files.                                                                                      | Stop exporting      |
| devDependency `@tailwindcss/turbopack`                     | Probably real (Tailwind 4 with Next uses `@tailwindcss/postcss`). Confirm with `--trace-dependency`, then remove. | Verify, then remove |

### Complexity (ordered by what to do first)

| Function                                                                                                                                       | Why it matters                                                                                                                                  | Plan                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `pup-layer.tsx` `tick` (cyc 40, 107 lines)                                                                                                     | The animation loop for Teddy: motion maths, facing, sit/bow/peek easing, footprints, DOM writes, all in one function. Highest risk in the repo. | Split into pure steps: `measureMotion`, `easeRig`, `placeActor`, `maybeFootprint`. Unit-test the pure ones like `rig.ts`. |
| `pup-layer.tsx` `resolve` (cyc 11)                                                                                                             | Handles pinned, peek and foot anchors in one function.                                                                                          | One resolver per fit mode.                                                                                                |
| `eye-tracker.tsx` `update` / `onDown`                                                                                                          | Pointer maths + DOM writes + hit-testing mixed.                                                                                                 | Extract `eyeOffset(pointer, box)` and `faceHit(point, box)` as pure functions (easy to test).                             |
| `page-curtain.tsx` `wantsCurtain` / `onClick`                                                                                                  | Many early-return conditions about which clicks to take over.                                                                                   | Table of named predicates (`isModified`, `isExternal`, `isSamePage`…), test them.                                         |
| `lib/pups.ts` `pupCopy` (cyc 14)                                                                                                               | One function builds ~15 strings for every page and ticket.                                                                                      | Split into `pupHeading`, `pupEnquiry`, `pupMeta`; also the top "split high-impact file" target (4 dependents).            |
| Big components: `EnquiryForm` (165 lines), `ContactLetter` (215), `PupStory` (168), `PupGallery` (128), `HeroStage` (168), `JourneyChat` (228) | Length, not branching. The two forms share validation, honey-pot and phase logic.                                                               | Pull a shared `useEnquiry` hook; split `PupStory` into Tag / Checklist / Journey / Letter pieces.                         |

### Duplication

- **CSS (3 of 6 groups):** the "paper" scalloped background and the sticky-note look are repeated in `how.css`, `passport.css` and `story.css`. Extract one `paper-pattern` custom property or utility.
- **`journey-chat.tsx` ↔ `two-ways.tsx`:** the same rAF-throttled scroll listener boilerplate. Extract a `useRafScroll(callback)` hook.
- **`how-it-works.tsx` ↔ `two-ways.tsx`:** a shared 12-line SVG block (route / plane). Extract a component.
- **`icons/paw.tsx` ↔ `happy-wall.tsx`:** the paw path is pasted twice. `happy-wall` should use `PawIcon`.

### Data (not flagged by fallow, found by the graph and by me)

- `data/pups.ts` (1,737 lines), `data/listing.ts` (275) and `data/puppies.ts` (231) all describe the same puppies. **`pups.ts` is the intended source of truth**; `/puppies` still reads `listing.ts` and the home page reads `puppies.ts`. Merge them (derive listing fields from `pups.ts`), then consider moving the generated data to JSON with a typed loader.
- `data/wall.ts` (809 lines) is generated and fine; same JSON option.

## Cross-check from code-review-graph

- **Largest files:** `pups.ts` 1737, `wall.ts` 809, `how-it-works.tsx` 513, `pup-layer.tsx` 404, `journey-chat.tsx` 343, `contact-letter.tsx` 336.
- **Largest functions:** `JourneyChat` 228 lines, `ContactLetter` 215.
- **Hub nodes (highest coupling, biggest blast radius):** `tick` (46 edges), `ContactLetter` (42), `HeroStage` (36), `actorAt` (36), `rigTransforms` (34), `MeetThePups` (33), `MobileMenu` (31), `EnquiryForm` (30). **Rig and timeline changes reach 58 files**, so keep them covered by tests.
- **Untested hotspots: 20.** Highest: `tick`, `ContactLetter`, `HeroStage`, `MeetThePups`, `MobileMenu`, `EnquiryForm`, `ButtonLink`, `PupProvider`, `JourneyChat`, `useTeddy`, `PageCurtain`.
- **Isolated helpers** (module-private functions, harmless): `sketch.tsx` `v`/`frame`, `puppies-board.tsx` `readSearch`/`serverSearch`/`v`, `pup-layer.tsx` `markDirty`.
- Fallow and the graph agree: **`pup-layer.tsx` is the one file that needs real refactoring**.

## Suggested order

1. **Quick wins (minutes):** delete `page-stub.tsx`; stop exporting the unused exports; verify and remove `@tailwindcss/turbopack`. Re-run fallow: expect dead code to reach about zero.
2. **`pup-layer.tsx`:** split `tick` and `resolve`, add unit tests for the pure steps (this is also the main untested hotspot).
3. **Merge the three puppy datasets** into `pups.ts`.
4. **Forms:** shared `useEnquiry` hook for `ContactLetter` and `EnquiryForm`.
5. **Small pure-function extractions** with tests: `eyeOffset`, `faceHit`, curtain click predicates, `pupCopy`.
6. **CSS and TSX duplication** (paper pattern, `useRafScroll`, shared SVG, `PawIcon`).
7. **Add coverage** (Vitest or `node --test` with c8) so CRAP becomes meaningful, then switch the complexity rules to "warn" in a `.fallowrc.json` and ratchet them down.
8. After the first commit, re-run with git history to get **hotspot (churn × complexity)** ranking.
