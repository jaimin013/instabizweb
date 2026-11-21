import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TeddyActor } from "@/components/mascot/teddy-actor";
import { ButtonLink } from "@/components/ui/button";
import { RevealScope } from "@/components/ui/reveal-scope";
import type { Pup } from "@/data/pups";
import { ticketFor } from "@/lib/pups";

/** One "admit one" cinema ticket: the puppy's photo, name and where they went from. */
function Ticket({ pup, index }: { pup: Pup; index: number }) {
  const { tilt, meta, route } = ticketFor(pup, index);
  const cover = pup.media[0];
  return (
    <li
      className="tp-ticket"
      data-reveal=""
      style={{ "--tilt": `${tilt}deg`, "--i": index } as CSSProperties}
    >
      <Link className="tp-ticket__link" href={`/puppies/${pup.slug}`}>
        <span className="tp-ticket__main">
          <span className="tp-ticket__photo">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="7rem"
              className="object-cover"
              style={{ objectPosition: `${cover.focus.x}% ${cover.focus.y}%` }}
            />
          </span>
          <span className="tp-ticket__body">
            <span className="tp-ticket__kicker font-hand-bouncy">one ticket home</span>
            <span className="tp-ticket__name font-plush">{pup.name}</span>
            <span className="tp-ticket__meta">{meta}</span>
            <span className="tp-ticket__route">
              <span>{route}</span>
              <svg viewBox="0 0 52 12" aria-hidden="true">
                <path d="M2 6h46" />
                <path d="M44 2l6 4-6 4" />
              </svg>
              <span>home ♥</span>
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="tp-ticket__stub">
          <span className="font-plush">admit one</span>
        </span>
      </Link>
    </li>
  );
}

/** /gone-home: a ticket booth with Teddy, and one ticket for every puppy who found a family. */
export function GoneTickets({ pups }: { pups: readonly Pup[] }) {
  return (
    <RevealScope>
      <div className="mx-auto max-w-[110rem] px-(--gutter) pt-10 pb-24 md:pt-16">
        <header className="tp-boothhead">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="ml-3 inline-block w-[0.45em] -translate-y-[0.15em] text-toffee"
                fill="currentColor"
              >
                <path d="M12 21s-7.500-4.600-9.600-9.300C.9 8.200 3 4.500 6.600 4.500c2 0 3.700 1.100 5.400 3 1.700-1.900 3.400-3 5.400-3 3.600 0 5.700 3.700 4.200 7.200C19.500 16.400 12 21 12 21z" />
              </svg>
            </h1>
            <p className="mt-6 text-lede text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us —
              we&apos;ll help you find your match.
            </p>
            <ButtonLink href="/puppies" className="mt-8">
              See available puppies
            </ButtonLink>
          </div>

          <div aria-hidden="true" className="tp-booth">
            <div className="tp-booth__teddy aspect-[300/240]">
              <TeddyActor params={{ sit: 1, facing: -1 }} />
            </div>
            <div className="tp-booth__counter">
              <span className="font-plush">tickets home</span>
            </div>
          </div>
        </header>

        <ul className="tp-tickets" aria-label="Puppies who have gone home">
          {pups.map((pup, i) => (
            <Ticket key={pup.slug} pup={pup} index={i} />
          ))}
        </ul>
      </div>
    </RevealScope>
  );
}
