import type { CSSProperties } from "react";
import { HeroStage, type Seat } from "@/components/sections/hero-stage";
import { ButtonLink } from "@/components/ui/button";
import { puppies } from "@/data/puppies";
import { site, whatsappLink } from "@/lib/site";

/**
 * One entry per arch. dx/dw/dpeek place it on desktop, mx/mpeek on phones.
 * dx is the arch centre as a % of the stage; peek is how much of the arch
 * shows above the ledge (1 = fully); tilt gives each its own lean.
 */
const seats: readonly Seat[] = [
  { slug: "maltipoo-max-male", dx: 9, dw: 8.6, dpeek: 0.62, tilt: -5, mx: 8, mpeek: 1.18 },
  { slug: "korean-teacup-pomeranian-1", dx: 22, dw: 9.8, dpeek: 0.82, tilt: -3, mx: 21, mpeek: 1.3 },
  { slug: "korean-teacup-poodle-female", dx: 35, dw: 9.2, dpeek: 0.7, tilt: -2, mx: 33.5, mpeek: 1.12 },
  { slug: "maltipoo-cavapoo-male", dx: 65, dw: 9.4, dpeek: 0.74, tilt: 3, mx: 66.5, mpeek: 1.12 },
  { slug: "maltipoo-female-2", dx: 78, dw: 10.4, dpeek: 0.88, tilt: 2, mx: 79, mpeek: 1.3 },
  { slug: "shitzu-male", dx: 91, dw: 8.4, dpeek: 0.6, tilt: 4, mx: 92, mpeek: 1.18 },
];

const wiggle = "M2 14C40 4 80 20 120 10S190 6 218 12";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero"
      style={{ "--quilt": "var(--color-cream)" } as CSSProperties}
    >
      <span aria-hidden="true" className="hero-sun" />

      <div className="hero-copy container-wide">
        <p className="relative inline-block font-hand-bouncy text-note text-toffee-ink">
          {site.motto}
          <svg
            viewBox="0 0 220 24"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute -bottom-2 left-0 h-3 w-full text-toffee"
          >
            <path d={wiggle} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </p>

        <h1
          id="hero-title"
          className="mx-auto mt-[clamp(0.5rem,1.6vh,1.1rem)] max-w-[15ch] text-hero heading-wonk"
        >
          <span className="block">Premium teacup</span>
          <span className="block">puppies in Dubai</span>
        </h1>

        <p className="mx-auto mt-[clamp(0.9rem,2.2vh,1.4rem)] max-w-[46ch] text-[clamp(1.05rem,1.25vw,1.28rem)] leading-normal text-ink-soft">
          {site.description}
        </p>

        <div className="mt-[clamp(1.1rem,3vh,2rem)] flex flex-wrap justify-center gap-3">
          <ButtonLink href="/puppies">View available puppies</ButtonLink>
          <ButtonLink href={whatsappLink()} variant="ghost">
            Enquire on WhatsApp
          </ButtonLink>
        </div>
      </div>

      <HeroStage seats={seats} puppies={puppies} />
    </section>
  );
}
