import { pups, type Pup } from "@/data/pups";
import { whatsappLink } from "@/lib/site";

/**
 * Everything a puppy page or ticket says about a puppy is worked out here from the record in
 * data/pups.ts, so no page hard-codes a name, a breed or a sentence for one puppy.
 */

const bySlug = new Map(pups.map((p) => [p.slug, p]));

export const availablePups = pups.filter((p) => p.status === "available");
export const gonePups = pups.filter((p) => p.status === "gone");

export const getPup = (slug: string): Pup | undefined => bySlug.get(slug);

const lower = (text: string) => text.toLowerCase();

/** "Maltipoo, boy, 3 months": the breed only for puppies with a name (otherwise the name already is the breed). */
const descriptor = (pup: Pup, joiner: string) =>
  [pup.named ? pup.breed : null, lower(pup.gender), pup.age].filter(Boolean).join(joiner);

export const hasVideo = (pup: Pup) => pup.media.some((m) => m.kind === "video");

/** Short caption, e.g. "Maltipoo, boy, 3 months, with video". */
export const caption = (pup: Pup) => descriptor(pup, ", ") + (hasVideo(pup) ? ", with video" : "");

/** The line under a card's name, e.g. "Maltipoo · boy · 3 months". */
export const cardMeta = (pup: Pup) => descriptor(pup, " · ");

/** Accessible name for a whole card. */
export const cardLabel = (pup: Pup) =>
  [
    pup.name,
    pup.named ? pup.breed : null,
    lower(pup.gender),
    pup.age,
    pup.status === "gone" ? "gone home" : "available",
  ]
    .filter(Boolean)
    .join(", ");

const BREED_KEYS = [
  ["maltipoo", "maltipoo"],
  ["pomeranian", "pomeranian"],
  ["poodle", "poodle"],
  ["cavapoo", "cavapoo"],
  ["shih tzu", "shih-tzu"],
] as const;

/** Filter tags for the breeds in a puppy's breed or name, e.g. "Maltipoo & Cavapoo" gives both. */
export const breedTags = (pup: Pup) =>
  BREED_KEYS.filter(([word]) => lower(`${pup.breed} ${pup.name}`).includes(word)).map(([, tag]) => tag);

/** "Boy & girl" is listed under both boys and girls. */
export const genderTags = (pup: Pup): ("male" | "female")[] =>
  lower(pup.gender).includes("&") ? ["male", "female"] : [lower(pup.gender) === "boy" ? "male" : "female"];

export const collectionOf = (pup: Pup) => (pup.slug.startsWith("korean-teacup") ? "korean-teacup" : null);

/** Previous and next puppy within the same group (available / gone home), wrapping round. */
export function neighbours(pup: Pup) {
  const group = pup.status === "gone" ? gonePups : availablePups;
  const i = group.findIndex((p) => p.slug === pup.slug);
  return {
    prev: group[(i - 1 + group.length) % group.length],
    next: group[(i + 1) % group.length],
  };
}

/** "Max" for a named puppy, "this Shih Tzu" for one without a name. */
const subject = (pup: Pup) => (pup.named ? pup.name : `this ${pup.name}`);

export function pupCopy(pup: Pup) {
  const gone = pup.status === "gone";
  const label = pup.named ? `${pup.name} (${pup.breed})` : `the ${pup.breed} puppy`;
  return {
    gone,
    /** Handwritten line above the first chapter. */
    kicker: gone ? "the day they went home" : "hello, it's me",
    /** Chapter number of the "what comes with" paper and of the enquiry letter. */
    paperChapter: 2,
    enquiryChapter: gone ? 3 : 4,
    paperKicker: `what comes with ${subject(pup)}`,
    whatsappLabel: gone
      ? "Ask about a puppy like this"
      : pup.named
        ? `Ask about ${pup.name} on WhatsApp`
        : "Ask about this puppy on WhatsApp",
    enquiryTitle: gone
      ? "Looking for a puppy like this?"
      : `Ask about ${pup.named ? pup.name : "this puppy"}`,
    enquiryText:
      "Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.",
    defaultMessage: `Hi! I'd love to know more about ${pup.named ? `${pup.name} (${pup.breed})` : pup.name}.`,
    whatsappHref: whatsappLink(
      gone
        ? `Hi TeddyPups! I'm looking for a puppy like ${label}.`
        : `Hi TeddyPups! I'd like to know more about ${label}.`,
    ),
    title: pup.named ? `${pup.name}, ${pup.breed} puppy` : `${pup.name} puppy, ${pup.gender.toLowerCase()}`,
    description: `${pup.named ? pup.name : `A ${pup.breed}`}: ${pup.gender.toLowerCase()}, ${pup.age}. ${
      gone
        ? "Has gone home to a loving family."
        : "Real photos of the actual puppy, imported for you or in our Dubai showroom."
    }`,
    /** The facts shown on the tag, in order. Colour only appears when the puppy has one. */
    facts: [
      ["Breed", pup.breed],
      ["Boy or girl", pup.gender],
      ["Age", pup.age],
      ...(pup.colour ? [["Colour", pup.colour] as const] : []),
      ["Where", pup.where],
    ] as const,
  };
}

const TILTS = [-1.4, 1.1, -0.6, 1.6, -1.1, 0.8] as const;

/** One cinema ticket on /gone-home. */
export function ticketFor(pup: Pup, index: number) {
  return {
    tilt: TILTS[index % TILTS.length],
    meta: pup.named ? `${pup.breed}, ${pup.gender.toLowerCase()}` : pup.gender,
    route: pup.where === "In Dubai" ? "Dubai showroom" : "TeddyPups",
  };
}
