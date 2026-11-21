/**
 * Single source of truth for business details and navigation.
 * Every page and component reads from here, so a phone number or a
 * nav label changes in exactly one place.
 */

const WHATSAPP_NUMBER = "919898124987";

export const site = {
  name: "TeddyPups",
  legalName: "TeddyPups U.A.E. - Demo clone made by Jaimin Kapadiya",
  tagline: "Premium teacup puppies in Dubai",
  motto: "every puppy is family",
  description:
    "Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.",
  about:
    "TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+971500000000",
  phoneDisplay: "+971 50 000 0000",
  email: "info@instabizweb.com",
  address: "Downtown Dubai, United Arab Emirates",
  whatsappNumber: WHATSAPP_NUMBER,
  buildYear: process.env.NEXT_PUBLIC_BUILD_YEAR ?? "2026",
} as const;

/** Build a wa.me deep link with an optional pre-filled message. */
export function whatsappLink(message = "Hi TeddyPups! I'd like to know more about your puppies.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/puppies", label: "Puppies" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
] as const;

export const footerNav = [
  { href: "/puppies", label: "Available puppies" },
  { href: "/gone-home", label: "Gone home" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/how-it-works#delivery", label: "Delivery & collection" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
] as const;

/** Placeholder profile URLs: swap for real handles when available. */
export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
] as const;

/** Is `href` the current page (or a parent of it)? `/puppies/x` keeps "Puppies" active. */
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const path = href.split("#")[0];
  return pathname === path || pathname.startsWith(`${path}/`);
}
