import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default scale, so custom
 * tokens are registered here. Without this it would treat
 * `text-hero` as a colour and drop `text-ink` next to it.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["hero", "display", "title", "note", "lede", "huge", "big", "giant"] }],
      shadow: [{ shadow: ["press", "press-hover", "sticker-sm", "sticker", "sticker-lg"] }],
    },
  },
});

/** Compose class names; later Tailwind classes win over earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
