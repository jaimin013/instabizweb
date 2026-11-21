/**
 * Puppies currently listed. Photos live in /public/puppies and belong to the
 * reference site (see README credits).
 *
 * `focus` is the point of the photo that must stay in frame when it is cropped
 * into arches/doors (CSS object-position, in %). `tint` is the photo's average
 * colour, shown while the image loads so nothing flashes white.
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

export const puppies: readonly Puppy[] = [
  {
    slug: "maltipoo-max-male",
    name: "Max",
    details: "Maltipoo, boy, 3 months, with video",
    hasVideo: true,
    photo: {
      src: "/puppies/maltipoo-max-male.webp",
      alt: "Max, male Maltipoo puppy",
      focus: { x: 53.8, y: 44.3 },
      tint: "#785838",
    },
    door: "#a24a1a",
  },
  {
    slug: "korean-teacup-maltipoo-female",
    name: "Korean Teacup Maltipoo",
    details: "girl, 2 months, with video",
    hasVideo: true,
    photo: {
      src: "/puppies/korean-teacup-maltipoo-female.jpg",
      alt: "Female Korean Teacup Maltipoo puppy",
      focus: { x: 52.5, y: 42.6 },
      tint: "#e8e8e8",
    },
    door: "#5a3a28",
  },
  {
    slug: "korean-teacup-poodle-female",
    name: "Korean Teacup Poodle",
    details: "girl, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/korean-teacup-poodle-female.jpg",
      alt: "Female Korean Teacup Poodle puppy",
      focus: { x: 54.5, y: 45.7 },
      tint: "#f8d8b8",
    },
    door: "#d4893f",
  },
  {
    slug: "maltipoo-cavapoo-male",
    name: "Maltipoo & Cavapoo",
    details: "boy, 3 months Maltipoo & 2 months Cavapoo, with video",
    hasVideo: true,
    photo: {
      src: "/puppies/maltipoo-cavapoo-male.jpg",
      alt: "Male Maltipoo & Cavapoo puppy",
      focus: { x: 44.7, y: 29.5 },
      tint: "#b8a8a8",
    },
    door: "#b8644a",
  },
  {
    slug: "toy-poodle-male-female",
    name: "Toy Poodle",
    details: "boy & girl, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/toy-poodle-male-female.jpg",
      alt: "Toy Poodle puppy",
      focus: { x: 65.4, y: 44.7 },
      tint: "#c8c8c8",
    },
    door: "#7a4a2e",
  },
  {
    slug: "maltipoo-female-2",
    name: "Maltipoo",
    details: "girl, 3 months, with video",
    hasVideo: true,
    photo: {
      src: "/puppies/maltipoo-female-2.jpg",
      alt: "Female Maltipoo puppy",
      focus: { x: 64.6, y: 42.3 },
      tint: "#080808",
    },
    door: "#a24a1a",
  },
  {
    slug: "pomeranian-female",
    name: "Pomeranian",
    details: "girl, 3 months",
    hasVideo: false,
    photo: {
      src: "/puppies/pomeranian-female.jpg",
      alt: "Female Pomeranian puppy",
      focus: { x: 40.3, y: 44.3 },
      tint: "#080808",
    },
    door: "#5a3a28",
  },
  {
    slug: "copper-male",
    name: "Copper",
    details: "Cavapoo, boy, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/copper-male.jpg",
      alt: "Copper, male Cavapoo puppy",
      focus: { x: 43, y: 50.5 },
      tint: "#e8d8c8",
    },
    door: "#d4893f",
  },
  {
    slug: "shitzu-female",
    name: "Shih Tzu",
    details: "girl, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/shitzu-female.jpeg",
      alt: "Female Shih Tzu puppy",
      focus: { x: 44.8, y: 42.5 },
      tint: "#383848",
    },
    door: "#b8644a",
  },
  {
    slug: "shitzu-male",
    name: "Shih Tzu",
    details: "boy, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/shitzu-male.jpg",
      alt: "Male Shih Tzu puppy",
      focus: { x: 40.3, y: 43.6 },
      tint: "#787888",
    },
    door: "#7a4a2e",
  },
  {
    slug: "maltipoo-female-1",
    name: "Maltipoo",
    details: "girl, 2.5 months",
    hasVideo: false,
    photo: {
      src: "/puppies/maltipoo-female-1.jpg",
      alt: "Female Maltipoo puppy",
      focus: { x: 47.5, y: 50.5 },
      tint: "#e8d8c8",
    },
    door: "#a24a1a",
  },
  {
    slug: "maltipoo-female",
    name: "Maltipoo",
    details: "girl, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/maltipoo-female.jpg",
      alt: "Female Maltipoo puppy",
      focus: { x: 56.9, y: 49.2 },
      tint: "#e8d8c8",
    },
    door: "#5a3a28",
  },
  {
    slug: "korean-teacup-pomeranian-1",
    name: "Korean Teacup Pomeranian",
    details: "girl, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/korean-teacup-pomeranian-1.jpg",
      alt: "Female Korean Teacup Pomeranian puppy",
      focus: { x: 49.9, y: 51.3 },
      tint: "#d8d8d8",
    },
    door: "#d4893f",
  },
  {
    slug: "korean-teacup-pomeranian",
    name: "Korean Teacup Pomeranian",
    details: "girl, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/korean-teacup-pomeranian.jpg",
      alt: "Female Korean Teacup Pomeranian puppy",
      focus: { x: 49.9, y: 48.6 },
      tint: "#484848",
    },
    door: "#b8644a",
  },
  {
    slug: "korean-teacup-pomeranian-male",
    name: "Korean Teacup Pomeranian",
    details: "boy, 2 months",
    hasVideo: false,
    photo: {
      src: "/puppies/korean-teacup-pomeranian-male.jpg",
      alt: "Male Korean Teacup Pomeranian puppy",
      focus: { x: 48.9, y: 44.1 },
      tint: "#080808",
    },
    door: "#7a4a2e",
  },
];

export function getPuppy(slug: string) {
  return puppies.find((p) => p.slug === slug);
}

/** CSS object-position for a puppy's focal point. */
export function focusOf(photo: Puppy["photo"]) {
  return `${photo.focus.x}% ${photo.focus.y}%`;
}
