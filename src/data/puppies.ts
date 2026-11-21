import { availablePups, caption, hasVideo } from "@/lib/pups";

/**
 * The puppies shown on the home page (hero lineup, "Meet the pups" hall, signposts), derived from
 * data/pups.ts, the single source of truth, so a change there shows up everywhere.
 *
 * `focus` is the point of the photo that must stay in frame when it is cropped into arches/doors
 * (CSS object-position, in %). `tint` is the photo's average colour, shown while the image loads so
 * nothing flashes white.
 */
export type Puppy = {
  slug: string;
  name: string;
  /** Short caption, e.g. "Maltipoo, boy, 3 months, with video". */
  details: string;
  hasVideo: boolean;
  photo: {
    src: string;
    alt: string;
    focus: { x: number; y: number };
    tint: string;
  };
  /** Door colour used on the "Meet the pups" hall. */
  door: string;
};

const DEFAULT_DOOR = "#5a3a28";

export const puppies: readonly Puppy[] = availablePups.map((pup) => {
  const cover = pup.media[0];
  return {
    slug: pup.slug,
    name: pup.name,
    details: caption(pup),
    hasVideo: hasVideo(pup),
    photo: { src: cover.src, alt: cover.alt, focus: cover.focus, tint: cover.color },
    door: pup.look?.door ?? DEFAULT_DOOR,
  };
});

export function getPuppy(slug: string) {
  return puppies.find((p) => p.slug === slug);
}

/** CSS object-position for a puppy's focal point. */
export function focusOf(photo: Puppy["photo"]) {
  return `${photo.focus.x}% ${photo.focus.y}%`;
}
