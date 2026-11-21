import {
  availablePups,
  breedTags,
  cardLabel,
  cardMeta,
  collectionOf,
  genderTags,
  gonePups,
  hasVideo,
} from "@/lib/pups";

/**
 * The cards on /puppies, derived from data/pups.ts (the single source of truth): one per available puppy,
 * plus a strip of the first few who have gone home.
 */
export type Listing = {
  slug: string;
  name: string;
  /** The line under the name, e.g. "Maltipoo · boy · 3 months". */
  meta: string;
  /** Accessible name for the whole card. */
  label: string;
  hasVideo: boolean;
  breeds: readonly string[];
  genders: readonly ("male" | "female")[];
  collection: "korean-teacup" | null;
  /** Tilt in degrees, reveal delay in ms (staggered in rows of eight) and the wash colour behind the photo. */
  tilt: number;
  delay: number;
  wash: string;
};

const DEFAULT_WASH = "#fbe3b4";

export const listings: readonly Listing[] = availablePups.map((pup, i) => ({
  slug: pup.slug,
  name: pup.name,
  meta: cardMeta(pup),
  label: cardLabel(pup),
  hasVideo: hasVideo(pup),
  breeds: breedTags(pup),
  genders: genderTags(pup),
  collection: collectionOf(pup),
  tilt: pup.look?.tilt ?? 0,
  delay: (i % 8) * 70,
  wash: pup.look?.wash ?? DEFAULT_WASH,
}));

export type GoneListing = {
  slug: string;
  name: string;
  label: string;
  photo: string;
  tilt: number;
  delay: number;
  wash: string;
};

/** How many already-gone puppies the strip under the list shows. */
const GONE_SHOWN = 5;

export const goneStrip: readonly GoneListing[] = gonePups.slice(0, GONE_SHOWN).map((pup, i) => ({
  slug: pup.slug,
  name: pup.name,
  label: cardLabel(pup),
  photo: pup.media[0].src,
  tilt: pup.look?.tilt ?? 0,
  delay: i * 70,
  wash: pup.look?.wash ?? DEFAULT_WASH,
}));
