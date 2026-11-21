// Generated from the reference listing. One row per puppy card on /puppies.

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
  /** Hand-set tilt in degrees, reveal delay in ms and the wash colour behind the photo. */
  tilt: number;
  delay: number;
  wash: string;
};

export const listings: readonly Listing[] = [
  {
    slug: "maltipoo-max-male",
    name: "Max",
    meta: "Maltipoo · boy · 3 months",
    label: "Max, Maltipoo, boy, 3 months, available",
    hasVideo: true,
    breeds: ["maltipoo"],
    genders: ["male"],
    collection: null,
    tilt: 0.36,
    delay: 0,
    wash: "#f2be6b",
  },
  {
    slug: "korean-teacup-maltipoo-female",
    name: "Korean Teacup Maltipoo",
    meta: "girl · 2 months",
    label: "Korean Teacup Maltipoo, girl, 2 months, available",
    hasVideo: true,
    breeds: ["maltipoo"],
    genders: ["female"],
    collection: "korean-teacup",
    tilt: -0.71,
    delay: 70,
    wash: "#bfddf5",
  },
  {
    slug: "korean-teacup-poodle-female",
    name: "Korean Teacup Poodle",
    meta: "girl · 2 months",
    label: "Korean Teacup Poodle, girl, 2 months, available",
    hasVideo: false,
    breeds: ["poodle"],
    genders: ["female"],
    collection: "korean-teacup",
    tilt: -0.42,
    delay: 140,
    wash: "#bfddf5",
  },
  {
    slug: "maltipoo-cavapoo-male",
    name: "Maltipoo & Cavapoo",
    meta: "boy · 3 months Maltipoo & 2 months Cavapoo",
    label: "Maltipoo & Cavapoo, boy, 3 months Maltipoo & 2 months Cavapoo, available",
    hasVideo: true,
    breeds: ["maltipoo", "cavapoo"],
    genders: ["male"],
    collection: null,
    tilt: -0.8,
    delay: 210,
    wash: "#f2be6b",
  },
  {
    slug: "toy-poodle-male-female",
    name: "Toy Poodle",
    meta: "boy & girl · 2 months",
    label: "Toy Poodle, boy & girl, 2 months, available",
    hasVideo: false,
    breeds: ["poodle"],
    genders: ["male", "female"],
    collection: null,
    tilt: 1.81,
    delay: 280,
    wash: "#bfddf5",
  },
  {
    slug: "maltipoo-female-2",
    name: "Maltipoo",
    meta: "girl · 3 months",
    label: "Maltipoo, girl, 3 months, available",
    hasVideo: true,
    breeds: ["maltipoo"],
    genders: ["female"],
    collection: null,
    tilt: 2.12,
    delay: 350,
    wash: "#bfddf5",
  },
  {
    slug: "pomeranian-female",
    name: "Pomeranian",
    meta: "girl · 3 months",
    label: "Pomeranian, girl, 3 months, available",
    hasVideo: false,
    breeds: ["pomeranian"],
    genders: ["female"],
    collection: null,
    tilt: 2.43,
    delay: 420,
    wash: "#fbe3b4",
  },
  {
    slug: "copper-male",
    name: "Copper",
    meta: "Cavapoo · boy · 2 months",
    label: "Copper, Cavapoo, boy, 2 months, available",
    hasVideo: false,
    breeds: ["cavapoo"],
    genders: ["male"],
    collection: null,
    tilt: 1.47,
    delay: 490,
    wash: "#fbe3b4",
  },
  {
    slug: "shitzu-female",
    name: "Shih Tzu",
    meta: "girl · 2 months",
    label: "Shih Tzu, girl, 2 months, available",
    hasVideo: false,
    breeds: ["shih-tzu"],
    genders: ["female"],
    collection: null,
    tilt: 0.09,
    delay: 0,
    wash: "#f2be6b",
  },
  {
    slug: "shitzu-male",
    name: "Shih Tzu",
    meta: "boy · 2 months",
    label: "Shih Tzu, boy, 2 months, available",
    hasVideo: false,
    breeds: ["shih-tzu"],
    genders: ["male"],
    collection: null,
    tilt: -0.61,
    delay: 70,
    wash: "#fbe3b4",
  },
  {
    slug: "maltipoo-female-1",
    name: "Maltipoo",
    meta: "girl · 2.5 months",
    label: "Maltipoo, girl, 2.5 months, available",
    hasVideo: false,
    breeds: ["maltipoo"],
    genders: ["female"],
    collection: null,
    tilt: 1.07,
    delay: 140,
    wash: "#e8c39a",
  },
  {
    slug: "maltipoo-female",
    name: "Maltipoo",
    meta: "girl · 2 months",
    label: "Maltipoo, girl, 2 months, available",
    hasVideo: false,
    breeds: ["maltipoo"],
    genders: ["female"],
    collection: null,
    tilt: -0.34,
    delay: 210,
    wash: "#bfddf5",
  },
  {
    slug: "korean-teacup-pomeranian-1",
    name: "Korean Teacup Pomeranian",
    meta: "girl · 2 months",
    label: "Korean Teacup Pomeranian, girl, 2 months, available",
    hasVideo: false,
    breeds: ["pomeranian"],
    genders: ["female"],
    collection: "korean-teacup",
    tilt: 2.24,
    delay: 280,
    wash: "#f9cdbf",
  },
  {
    slug: "korean-teacup-pomeranian",
    name: "Korean Teacup Pomeranian",
    meta: "girl · 2 months",
    label: "Korean Teacup Pomeranian, girl, 2 months, available",
    hasVideo: false,
    breeds: ["pomeranian"],
    genders: ["female"],
    collection: "korean-teacup",
    tilt: -1.8,
    delay: 350,
    wash: "#f9cdbf",
  },
  {
    slug: "korean-teacup-pomeranian-male",
    name: "Korean Teacup Pomeranian",
    meta: "boy · 2 months",
    label: "Korean Teacup Pomeranian, boy, 2 months, available",
    hasVideo: false,
    breeds: ["pomeranian"],
    genders: ["male"],
    collection: "korean-teacup",
    tilt: 0.19,
    delay: 420,
    wash: "#fbe3b4",
  },
];

export type GoneListing = {
  slug: string;
  name: string;
  label: string;
  photo: string;
  tilt: number;
  delay: number;
  wash: string;
};

export const goneStrip: readonly GoneListing[] = [
  {
    slug: "pomeranian-ace-boy",
    name: "Ace",
    label: "Ace, Pomeranian, boy, 3 months, gone home",
    photo: "/gone/pomeranian-ace-boy.jpg",
    tilt: -0.63,
    delay: 0,
    wash: "#f9cdbf",
  },
  {
    slug: "poodle-leo-male",
    name: "Leo",
    label: "Leo, Poodle, boy, 3 months, gone home",
    photo: "/gone/poodle-leo-male.jpg",
    tilt: 0.28,
    delay: 70,
    wash: "#f9cdbf",
  },
  {
    slug: "maltipoo-mia-girl",
    name: "Mia",
    label: "Mia, Maltipoo, girl, 3 months, gone home",
    photo: "/gone/maltipoo-mia-girl.jpg",
    tilt: -0.47,
    delay: 140,
    wash: "#bfddf5",
  },
  {
    slug: "maltipoo-sadie-girl",
    name: "Sadie",
    label: "Sadie, Maltipoo, girl, 3 months, gone home",
    photo: "/gone/maltipoo-sadie-girl.jpg",
    tilt: 0.31,
    delay: 210,
    wash: "#e8c39a",
  },
  {
    slug: "blue-marle-pomeranian",
    name: "Pomeranian",
    label: "Pomeranian, boy, 3 months, gone home",
    photo: "/gone/blue-marle-pomeranian.jpg",
    tilt: 2.49,
    delay: 280,
    wash: "#e8c39a",
  },
];
