"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Sketch } from "@/components/gallery/sketch";
import { RevealScope } from "@/components/ui/reveal-scope";
import { goneStrip, listings } from "@/data/listing";
import { puppies } from "@/data/puppies";
import { ButtonLink } from "@/components/ui/button";
import { TeddyActor } from "@/components/mascot/teddy-actor";

type Filters = { origin: string; collection: string; breed: string; gender: string };

const where = [
  { key: "origin", value: "imported", label: "Imported" },
  { key: "collection", value: "korean-teacup", label: "Korean Teacup" },
] as const;
const breeds = [
  { value: "maltipoo", label: "Maltipoo" },
  { value: "pomeranian", label: "Pomeranian" },
  { value: "poodle", label: "Poodle" },
  { value: "cavapoo", label: "Cavapoo" },
  { value: "shih-tzu", label: "Shih Tzu" },
] as const;
const genders = [
  { value: "male", label: "Boys" },
  { value: "female", label: "Girls" },
] as const;

const bySlug = new Map(puppies.map((p) => [p.slug, p]));

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" aria-pressed={on} className="tp-sticker-chip" onClick={onClick}>
      {children}
    </button>
  );
}

/** The filter pad + the grid. Filters live in the URL (shareable) but change without a navigation. */
/**
 * The filters live in the URL (so a filtered list can be shared) but change without a navigation.
 * They are read with useSyncExternalStore: on the server, and while hydrating, the search is empty, so the
 * server HTML is the full list and hydration always matches; the real filters apply right after.
 */
const listeners = new Set<() => void>();
const subscribe = (notify: () => void) => {
  listeners.add(notify);
  window.addEventListener("popstate", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("popstate", notify);
  };
};
const readSearch = () => window.location.search;
const serverSearch = () => "";

function useFilters() {
  const search = useSyncExternalStore(subscribe, readSearch, serverSearch);
  const params = new URLSearchParams(search);
  const filters: Filters = {
    origin: params.get("origin") ?? "",
    collection: params.get("collection") ?? "",
    breed: params.get("breed") ?? "",
    gender: params.get("gender") ?? "",
  };
  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    const query = new URLSearchParams(Object.entries(next).filter(([, v]) => v)).toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
    listeners.forEach((notify) => notify());
  };
  return { filters, update };
}

function Board() {
  const { filters, update } = useFilters();
  const toggle = (key: keyof Filters, value: string) =>
    update({ [key]: filters[key] === value ? "" : value });

  const shown = useMemo(
    () =>
      listings.filter(
        (l) =>
          (!filters.collection || l.collection === filters.collection) &&
          (!filters.breed || l.breeds.includes(filters.breed)) &&
          (!filters.gender || l.genders.includes(filters.gender as "male" | "female")),
        // Every puppy listed is imported, so "Imported" never narrows the list (like the original).
      ),
    [filters],
  );
  const filtered = Object.values(filters).some(Boolean);
  const everywhere = !filters.origin && !filters.collection;

  return (
    <>
      <div className="tp-sketchpad flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 w-full shrink-0 font-hand-bouncy text-cocoa-soft sm:w-28">where</span>
          <Chip on={everywhere} onClick={() => update({ origin: "", collection: "" })}>
            Everywhere
          </Chip>
          {where.map((w) => (
            <Chip key={w.value} on={filters[w.key] === w.value} onClick={() => toggle(w.key, w.value)}>
              {w.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 w-full shrink-0 font-hand-bouncy text-cocoa-soft sm:w-28">breed</span>
          {breeds.map((b) => (
            <Chip key={b.value} on={filters.breed === b.value} onClick={() => toggle("breed", b.value)}>
              {b.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 w-full shrink-0 font-hand-bouncy text-cocoa-soft sm:w-28">boy or girl</span>
          {genders.map((g) => (
            <Chip key={g.value} on={filters.gender === g.value} onClick={() => toggle("gender", g.value)}>
              {g.label}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-10 font-hand-bouncy text-lg text-ink-soft" aria-live="polite">
        {shown.length === 0
          ? "No puppies match just yet, try fewer filters"
          : filtered
            ? `${shown.length} ${shown.length === 1 ? "puppy matches" : "puppies match"}`
            : `${shown.length} puppies looking for a home`}
      </p>

      <ul className="tp-sketches mt-8">
        {shown.map((l, i) => {
          const puppy = bySlug.get(l.slug);
          if (!puppy) return null;
          return (
            <Sketch
              key={l.slug}
              index={i}
              href={`/puppies/${l.slug}`}
              name={l.name}
              label={l.label}
              photo={puppy.photo.src}
              alt={puppy.photo.alt}
              tint={puppy.photo.tint}
              focus={puppy.photo.focus}
              tilt={l.tilt}
              delay={l.delay}
              wash={l.wash}
              sticker="available"
              meta={l.meta}
              video={l.hasVideo}
              sizes="(min-width: 1536px) 17rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
            />
          );
        })}
      </ul>
    </>
  );
}

export function PuppiesBoard() {
  return (
    <RevealScope>
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="mx-auto max-w-[110rem] px-(--gutter) pt-10 pb-24 md:pt-16">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-hand-bouncy text-lg text-toffee-ink" data-reveal="">
                from Teddy&apos;s sketchbook
              </p>
              <h1 id="pups-title" className="tp-sketchbook__title font-plush text-giant" data-reveal="">
                Available puppies
                <svg
                  className="tp-sketchbook__underline"
                  viewBox="0 0 1000 60"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M10 36C150 12 320 52 500 30S850 14 990 34" pathLength={1} />
                </svg>
              </h1>
              <p className="tp-sketchbook__lede mt-6 max-w-[46ch] text-lede text-cocoa-soft" data-reveal="">
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask
                us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" data-reveal="">
              <div className="aspect-[300/240]">
                <TeddyActor params={{ sit: 1, facing: -1 }} />
              </div>
              <span className="tp-sketchbook__caption font-hand-bouncy">self-portrait</span>
            </div>
          </div>

          <div className="mt-12">
            <Board />
          </div>
        </div>
      </section>

      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="mx-auto flex max-w-[110rem] flex-col gap-10 px-(--gutter) md:flex-row md:items-center">
          <div className="md:w-1/3" data-reveal="">
            <h2 id="gone-title" className="font-plush text-big">
              Already gone home
            </h2>
            <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
            <ButtonLink href="/gone-home" className="mt-6">
              See the puppies who&apos;ve gone home
            </ButtonLink>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {goneStrip.map((g, i) => (
              <Sketch
                key={g.slug}
                small
                index={i + 20}
                href={`/puppies/${g.slug}`}
                name={g.name}
                label={g.label}
                photo={g.photo}
                alt={g.label}
                tilt={g.tilt}
                delay={g.delay}
                wash={g.wash}
                sticker="home"
                sizes="9rem"
              />
            ))}
          </ul>
        </div>
      </section>
    </RevealScope>
  );
}
