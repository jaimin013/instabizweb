"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { TeddyActor } from "@/components/mascot/teddy-actor";
import { ButtonLink } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Hand-drawn icons for the step cards (drawn for this site). */
const icons = {
  search: (
    <>
      <circle cx="26" cy="26" r="13" {...line} />
      <path d="m36 36 14 14" {...line} />
      <path d="M20 26h12M26 20v12" {...line} />
    </>
  ),
  heart: (
    <path
      d="M32 54C14 42 8 31 8 22c0-7 5-12 11-12 5 0 9 3 13 8 4-5 8-8 13-8 6 0 11 5 11 12 0 9-6 20-24 32z"
      {...line}
    />
  ),
  clock: (
    <>
      <circle cx="32" cy="32" r="21" {...line} />
      <path d="M32 18v15l10 6" {...line} />
    </>
  ),
  truck: (
    <>
      <path d="M6 20h30v22H6zM36 28h12l10 10v4H36z" {...line} />
      <circle cx="18" cy="46" r="5" {...line} />
      <circle cx="46" cy="46" r="5" {...line} />
    </>
  ),
  bookmark: <path d="M16 8h32v48L32 44 16 56z" {...line} />,
  chat: (
    <>
      <path d="M8 14h48v30H30l-12 10V44H8z" {...line} />
      <path d="M18 26h28M18 34h18" {...line} />
    </>
  ),
  plane: <path d="M6 36l50-22-10 28-15-5-10 12-2-14z" {...line} />,
  home: (
    <>
      <path d="M8 30L32 8l24 22M14 26v28h36V26" {...line} />
      <path d="M32 46c-6-4-8-6-8-9 0-2 2-4 4-4 2 0 3 1 4 3 1-2 2-3 4-3 2 0 4 2 4 4 0 3-2 5-8 9z" {...line} />
    </>
  ),
} satisfies Record<string, ReactNode>;

type Step = { icon: keyof typeof icons; title: string; text: string; tint: string };

const journeys = [
  {
    id: "local",
    label: "In Dubai",
    hint: "meet in person",
    title: "Meet your puppy in person",
    lede: "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks.",
    note: null,
    steps: [
      {
        icon: "search",
        title: "Explore our puppies",
        text: "Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information.",
        tint: "#fbe3b4",
      },
      {
        icon: "heart",
        title: "Choose your puppy",
        text: "Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions.",
        tint: "#fde6de",
      },
      {
        icon: "clock",
        title: "Meet before you choose",
        text: "Spend time bonding before making your decision.",
        tint: "#e3f0fb",
      },
      {
        icon: "truck",
        title: "Pick-up or delivery",
        text: "Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably.",
        tint: "#e6f2df",
      },
    ] satisfies Step[],
  },
  {
    id: "imported",
    label: "Imported",
    hint: "order upon request",
    title: "Order upon request",
    lede: "Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.",
    note: "From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you.",
    steps: [
      {
        icon: "bookmark",
        title: "Reserve your puppy",
        text: "Browse our selection of available breeds and place a reservation for the teacup puppy that captures your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences.",
        tint: "#fbe3b4",
      },
      {
        icon: "chat",
        title: "Personalized consultation",
        text: "Once your reservation is confirmed, we will work closely with you to finalize details and provide updates on your puppy's journey.",
        tint: "#fde6de",
      },
      {
        icon: "plane",
        title: "Import and arrival",
        text: "We manage all aspects of the import process, including health checks, travel arrangements, and necessary documentation. Your puppy will be carefully transported and will arrive ready to join your family.",
        tint: "#e3f0fb",
      },
      {
        icon: "home",
        title: "Welcome home",
        text: "Upon arrival, we provide support to help your new puppy acclimate to their new environment. Our team is available for any additional assistance and to ensure a smooth transition into your home.",
        tint: "#e6f2df",
      },
    ] satisfies Step[],
  },
] as const;

/** Skyline line-art for the Dubai postcard. */
const SKYLINE =
  "M0 100H300M24 100V70H46V100M54 100V56H70V100M92 100V50L98 22L101 6L104 22L110 50V100M122 100V54L146 46V100M156 100V38H178V100M188 100V66H210V100M220 100V72H246V100M254 100V84H282V100";

/** The two-tab "Two ways home" explainer. Arrow keys move between tabs, like a native tablist. */
export function Journeys() {
  const [at, setAt] = useState(0);
  const root = useRef<HTMLElement>(null);
  // Step cards only animate in once the page is interactive, so there is no flash before hydration.
  useEffect(() => root.current?.setAttribute("data-ready", ""), []);

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") setAt((a) => Math.min(journeys.length - 1, a + 1));
    if (event.key === "ArrowLeft") setAt((a) => Math.max(0, a - 1));
  };

  return (
    <section ref={root} className="journeys" aria-labelledby="two-ways-title">
      <div className="journeys-top">
        <div>
          <p className="journeys-kicker font-hand-bouncy">choose your way</p>
          <h2 id="two-ways-title" className="text-big">
            Two ways home
          </h2>
        </div>
        <div className="journeys-pick">
          <div
            role="tablist"
            aria-label="Ways to bring your puppy home"
            className="switch"
            style={{ "--at": at, "--n": journeys.length } as CSSProperties}
            onKeyDown={onKey}
          >
            <span aria-hidden="true" className="switch-thumb" />
            {journeys.map((j, i) => (
              <button
                key={j.id}
                type="button"
                role="tab"
                id={`tab-${j.id}`}
                aria-selected={at === i}
                aria-controls={`panel-${j.id}`}
                tabIndex={at === i ? 0 : -1}
                className="switch-tab"
                onClick={() => setAt(i)}
              >
                <span className="switch-label font-plush">{j.label}</span>
                <span className="switch-hint">{j.hint}</span>
              </button>
            ))}
          </div>
          <div className="journeys-teddy aspect-[300/240]">
            <TeddyActor params={{ sit: 1 }} />
          </div>
        </div>
      </div>

      {journeys.map((j, i) => (
        <div
          key={j.id}
          role="tabpanel"
          id={`panel-${j.id}`}
          aria-labelledby={`tab-${j.id}`}
          className="journey"
          hidden={at !== i}
        >
          <div className="journey-head">
            <div>
              <h3 className="journey-title">{j.title}</h3>
              <p className="mt-4 text-lede text-ink-soft">{j.lede}</p>
              {j.note && <p className="mt-4 font-hand text-toffee-ink">{j.note}</p>}
            </div>
            {j.id === "local" ? (
              <div aria-hidden="true" className="postcard">
                <span className="postcard-sun" />
                <svg viewBox="0 0 300 110" className="postcard-city">
                  <path d={SKYLINE} {...line} />
                </svg>
                <span className="postcard-to postcard-to--left font-hand">Downtown Dubai</span>
              </div>
            ) : (
              <div aria-hidden="true" className="postcard postcard--sky">
                <svg viewBox="0 0 300 160" className="postcard-route">
                  <path d="M20 130C70 20 190 10 280 90" />
                </svg>
                <svg viewBox="0 0 64 64" className="postcard-plane">
                  <path d="M6 36l50-22-10 28-15-5-10 12-2-14z" {...line} />
                </svg>
                <span className="postcard-from font-hand">Europe · Korea</span>
                <span className="postcard-to font-hand">Dubai</span>
              </div>
            )}
          </div>

          <ol className="steps">
            {j.steps.map((step, s) => (
              <li
                key={step.title}
                className="step"
                style={{ "--i": s, "--tint": step.tint } as CSSProperties}
              >
                <span aria-hidden="true" className="step-icon">
                  <svg viewBox="0 0 64 64">{icons[step.icon]}</svg>
                </span>
                <span className="step-num font-plush">Step {s + 1}</span>
                <h4 className="step-title font-plush-text">{step.title}</h4>
                <p className="step-text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

const promise = [
  {
    shape: "round",
    ink: "#a24a1a",
    tilt: -8,
    title: "Hand-selected breeders",
    text: "We work only with breeders who uphold the highest ethical and health standards.",
  },
  {
    shape: "ticket",
    ink: "#1f6b45",
    tilt: 5,
    title: "Full transparency",
    text: "Photos, videos, and health certificates are shared before your puppy travels.",
  },
  {
    shape: "oval",
    ink: "#5a3a28",
    tilt: -4,
    title: "Safe, stress-free delivery",
    text: "We handle every detail of the import process, so your puppy arrives happy, healthy, and ready to love you.",
  },
] as const;

const deliveries = [
  [
    "Take your puppy home the same day",
    "Local puppies are available immediately — visit, fall in love, and go home together.",
  ],
  [
    "Delivery within Dubai",
    "Prefer to stay home? We deliver your puppy to your door within Dubai, safely and comfortably.",
  ],
  [
    "Safe international cargo",
    "We handle all the paperwork and ensure comfortable travel so your puppy arrives happy and stress-free.",
  ],
  [
    "Worldwide delivery",
    "We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.",
  ],
] as const;

const reasons = [
  {
    icon: "plane",
    title: "International cargo",
    text: "We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.",
  },
  {
    icon: "chat",
    title: "Support 24/7",
    text: "Our team is available 24/7 to answer your questions and assist you through every step of the adoption process. From choosing your puppy to post-delivery support — we're just a message away.",
  },
  {
    icon: "heart",
    title: "Health guarantee",
    text: "All our puppies come with a verified health certificate from licensed vets. We ensure every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.",
  },
] as const;

const stampIcons = {
  round: (
    <>
      <path
        d="M32 55C14 43 9 31 9 23c0-7 5-12 11-12 5 0 9 3 12 7 3-4 7-7 12-7 6 0 11 5 11 12 0 8-5 20-23 32z"
        {...line}
        strokeWidth={3}
      />
      <path d="M19 31h8l3-8 5 15 3-7h9" {...line} strokeWidth={3} />
    </>
  ),
  ticket: <path d="M8 36l46-20-9 24-13-4-9 10-2-13z" {...line} strokeWidth={3} />,
  oval: (
    <>
      <circle cx="32" cy="32" r="21" {...line} strokeWidth={3} />
      <path d="M32 20v13l9 5" {...line} strokeWidth={3} />
    </>
  ),
} as const;

/** The long-form part of /how-it-works below the switch: promise, delivery, why us, care. */
export function HowTail() {
  return (
    <>
      <section id="promise" aria-labelledby="promise-title" className="paper mt-24 -rotate-[0.6deg]">
        <p aria-hidden="true" className="font-hand text-lg text-toffee-ink">
          puppy passport
        </p>
        <h2 id="promise-title" className="mt-1 max-w-[16ch] text-huge">
          Our premium puppy promise
        </h2>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {promise.map((p, i) => (
            <li
              key={p.title}
              className="entry"
              style={{ "--ink-stamp": p.ink, "--tilt": `${p.tilt}deg`, "--i": i } as CSSProperties}
            >
              <span className={`stamp stamp--${p.shape}`}>
                <svg viewBox="0 0 64 64" className="stamp-icon" aria-hidden="true">
                  {stampIcons[p.shape]}
                </svg>
                <span className="stamp-title font-plush">{p.title}</span>
              </span>
              <p className="entry-text">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="delivery"
        aria-labelledby="delivery-title"
        className="mt-24 grid items-center gap-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-6">
          <h2 id="delivery-title" className="text-huge">
            Delivery &amp; collection
          </h2>
          <p className="mt-5 text-lede text-ink-soft">
            From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably
            and arrives safely.
          </p>
          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {deliveries.map(([title, text]) => (
              <li key={title}>
                <h3 className="font-plush-text text-[1.3rem] leading-snug font-bold">{title}</h3>
                <p className="mt-1.5 text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[clamp(14rem,30vw,22rem)] lg:col-span-6">
          <div className="flight">
            <svg viewBox="0 0 660 300" role="img" aria-label="A plane flying from Korea to Dubai">
              <path d="M40 250C170 40 470 20 620 168" className="flight-route" />
              <circle cx="40" cy="250" r="7" className="flight-dot" />
              <circle cx="620" cy="168" r="7" className="flight-dot" />
              <text x="40" y="284" textAnchor="middle" className="flight-label">
                Korea
              </text>
              <text x="620" y="202" textAnchor="middle" className="flight-label">
                Dubai
              </text>
              <g transform="translate(360 54) rotate(-4)">
                <g className="plane-art" transform="scale(1.22)">
                  <path d="M-26 -16L-58 -66L-22 -66L18 -16Z" className="flight-wing flight-wing--far" />
                  <path d="M-62 -14L-84 -46L-52 -46L-34 -14Z" className="flight-wing" />
                  <path
                    d="M-88 0C-88 -20 -62 -30 -14 -30H38C74 -30 96 -16 96 0C96 16 74 30 38 30H-14C-62 30 -88 20 -88 0Z"
                    className="flight-body"
                  />
                  <path d="M-22 16L-56 68L-18 68L24 16Z" className="flight-wing" />
                  <path d="M66 -14C78 -11 86 -4 90 6" className="flight-line" />
                  <circle cx="14" cy="-2" r="14" className="flight-porthole" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      <section id="why" aria-labelledby="why-title" className="mt-24 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="why-title" className="text-huge">
            Why choose us
          </h2>
          <p className="mt-6 text-lede text-ink-soft">
            We&apos;re here to help you find a new family member. From the moment you visit our site to the
            joyful day your puppy arrives at your door, we&apos;re with you every step of the way. Our mission
            is to make the entire adoption process smooth, transparent, and full of love.
          </p>
        </div>
        <ul className="space-y-8 lg:col-span-6 lg:col-start-7">
          {reasons.map((r) => (
            <li key={r.title} className="flex gap-5">
              <svg viewBox="0 0 64 64" className="size-14 shrink-0 text-toffee-deep" aria-hidden="true">
                {icons[r.icon]}
              </svg>
              <div>
                <h3 className="text-[1.7rem]">{r.title}</h3>
                <p className="mt-2 text-ink-soft">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="care-title"
        className="board mt-24 grid items-center gap-8 md:grid-cols-[1fr_auto] md:p-12!"
      >
        <div>
          <h2 id="care-title" className="text-big">
            Unique and high quality puppies
          </h2>
          <p className="measure mt-5 text-lede text-cocoa-soft">
            When you choose TeddyPups, you can trust that you&apos;re getting a puppy of the highest quality.
            We also provide guidance and support to new pet owners, offering advice on training, nutrition,
            and general care to ensure a smooth transition for you and your new furry friend.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={whatsappLink()} variant="whatsapp">
              Ask us on WhatsApp
            </ButtonLink>
            <ButtonLink href="/puppies" variant="ghost">
              See available puppies
            </ButtonLink>
          </div>
        </div>
        <div className="aspect-[300/240] w-44 justify-self-center md:w-56">
          <TeddyActor params={{ sit: 1, facing: -1 }} />
        </div>
      </section>
    </>
  );
}

const chips = [
  ["#two-ways", "Two ways home"],
  ["#promise", "Our premium puppy promise"],
  ["#delivery", "Delivery & collection"],
  ["#why", "Why choose us"],
] as const;

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-title"
      className="theme-light-sand"
      style={{ background: "linear-gradient(#fffbf3, #f6cc85)" }}
    >
      <div className="mx-auto w-full max-w-[110rem] px-(--gutter) pt-10 pb-24 md:pt-16">
        <header className="grid gap-8 md:grid-cols-12 md:items-end">
          <h1 id="how-title" className="text-giant md:col-span-7">
            How it works
          </h1>
          <p className="text-lede text-ink-soft md:col-span-5 md:pb-4">
            Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here
            to make the experience unforgettable.
          </p>
        </header>

        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
          {chips.map(([href, label], i) => (
            <a
              key={href}
              href={href}
              className="chip h-11 border-2 border-cocoa bg-milk px-4 hover:bg-honey-soft"
            >
              <span className="font-plush text-toffee">{i + 1}</span> {label}
            </a>
          ))}
        </nav>

        <div id="two-ways">
          <Journeys />
        </div>
        <HowTail />
      </div>
    </section>
  );
}
