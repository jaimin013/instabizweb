import Image from "next/image";
import Link from "next/link";
import { EnquiryForm } from "@/components/pup-page/enquiry-form";
import { PupGallery } from "@/components/pup-page/pup-gallery";
import { StoryRibbon } from "@/components/pup-page/story-ribbon";
import { TagBuddy } from "@/components/pup-page/tag-buddy";
import { PawIcon } from "@/components/icons/paw";
import { ButtonLink } from "@/components/ui/button";
import { RevealScope } from "@/components/ui/reveal-scope";
import type { Pup } from "@/data/pups";
import { neighbours, pupCopy } from "@/lib/pups";
import { site } from "@/lib/site";

const included = [
  "Vaccinated",
  "Dewormed",
  "Verified health certificate from licensed vets",
  "Thoroughly checked before joining your family",
] as const;

const journey = [
  { title: "Reserve your puppy", text: "Tell us which puppy has captured your heart." },
  {
    title: "Personalized consultation",
    text: "We finalize details with you and share updates on your puppy's journey.",
  },
  { title: "Import and arrival", text: "We manage health checks, travel arrangements, and documentation." },
  {
    title: "Welcome home",
    text: "We help your new puppy settle in and ensure a smooth transition into your home.",
  },
] as const;

function Chapter({ n, children }: { n: number; children: string }) {
  return (
    <p className="tp-chapter">
      <span aria-hidden="true" className="tp-chapter__n font-plush">
        {n}
      </span>
      <span className="font-hand-bouncy">{children}</span>
    </p>
  );
}

function Neighbour({ pup, label, last }: { pup: Pup; label: string; last?: boolean }) {
  const cover = pup.media[0];
  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className={`group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 ${last ? "sm:flex-row-reverse sm:text-right" : ""}`}
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="5rem"
          className="object-cover"
          style={{ objectPosition: `${cover.focus.x}% ${cover.focus.y}%` }}
        />
      </span>
      <span>
        <span className="block font-hand-bouncy text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{pup.name}</span>
      </span>
    </Link>
  );
}

/**
 * One puppy's page, a "storybook": hello (photos + tag), what comes with them, the way home,
 * a letter to the team. Every word and photo comes from the Pup record, so the same component
 * serves available puppies and ones that have gone home (which skip "the way home").
 */
export function PupStory({ pup }: { pup: Pup }) {
  const copy = pupCopy(pup);
  const { prev, next } = neighbours(pup);
  const url = `${site.url}/puppies/${pup.slug}`;
  const crumbs = copy.gone
    ? { href: "/gone-home", label: "Gone home" }
    : { href: "/puppies", label: "Available puppies" };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: crumbs.label, item: `${site.url}${crumbs.href}` },
      { "@type": "ListItem", position: 2, name: pup.name, item: url },
    ],
  };
  const chapterAfterPaper = copy.paperChapter + 1;

  return (
    <RevealScope>
      <article
        className="tp-storybook"
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, ${pup.media[0].color} 24%, var(--color-milk)) 0, var(--color-milk) 85%)`,
        }}
      >
        <StoryRibbon />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        <div className="mx-auto max-w-[110rem] px-(--gutter) pt-8 pb-20 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
            <Link className="link-ink" href={crumbs.href}>
              {crumbs.label}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{pup.name}</span>
          </nav>

          <Chapter n={1}>{copy.kicker}</Chapter>

          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <PupGallery name={pup.name} media={pup.media} />
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                <div
                  className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20"
                  data-reveal=""
                >
                  <span aria-hidden="true" className="tp-tag__ring" />
                  <TagBuddy />
                  {copy.gone ? (
                    <span className="inline-grid -rotate-6 place-items-center rounded-full border-[3px] border-current px-3 py-1 font-hand-bouncy text-sm tracking-wide text-toffee-deep uppercase">
                      Gone home ♥
                    </span>
                  ) : (
                    <span className="chip">
                      <PawIcon className="size-4 text-toffee" />
                      Available
                    </span>
                  )}
                  <h1 className="mt-4 font-plush text-[clamp(2.6rem,5vw,4.6rem)]">{pup.name}</h1>
                  {pup.named ? (
                    <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>
                  ) : null}
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                    {copy.facts.map(([term, value]) => (
                      <div key={term}>
                        <dt className="font-hand-bouncy text-sm text-cocoa-soft">{term}</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-8 flex flex-col gap-3">
                    <ButtonLink href={copy.whatsappHref} variant="whatsapp">
                      {copy.whatsappLabel}
                    </ButtonLink>
                    <ButtonLink href={`#enquire-${pup.slug}`} variant="ghost">
                      Send an enquiry
                    </ButtonLink>
                  </div>
                </div>

                <div className="tp-paper mt-8 -rotate-1">
                  <Chapter n={copy.paperChapter}>{copy.paperKicker}</Chapter>
                  <h2 className="mt-1 font-plush text-[1.9rem]">Every Teddy Pup comes</h2>
                  <ul className="mt-4 space-y-2.5">
                    {included.map((line) => (
                      <li key={line} className="flex items-start gap-3 font-semibold">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="mt-0.5 size-5 shrink-0 text-toffee-deep"
                        >
                          <path
                            d="m4 12.5 5 5L20 6.500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {!copy.gone ? (
            <section aria-labelledby={`home-steps-${pup.slug}`} className="mt-20" data-reveal="">
              <Chapter n={chapterAfterPaper}>the way home</Chapter>
              <h2 id={`home-steps-${pup.slug}`} className="mt-3 font-plush text-big">
                Coming home from abroad
              </h2>
              <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
                {journey.map((step, i) => (
                  <li key={step.title}>
                    <span aria-hidden="true" className="tp-trail__num font-plush">
                      {i + 1}
                    </span>
                    <h3 className="font-plush-text text-xl leading-tight font-bold">{step.title}</h3>
                    <p className="mt-2 max-w-[38ch] text-cocoa-soft">{step.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section
            id={`enquire-${pup.slug}`}
            aria-labelledby={`enquire-title-${pup.slug}`}
            className="tp-letter mt-20 grid gap-10 lg:grid-cols-12"
          >
            <span aria-hidden="true" className="tp-letter__stamp">
              <PawIcon className="size-9" />
            </span>
            <div className="lg:col-span-4">
              <Chapter n={copy.enquiryChapter}>dear TeddyPups…</Chapter>
              <h2 id={`enquire-title-${pup.slug}`} className="mt-2 font-plush text-big">
                {copy.enquiryTitle}
              </h2>
              <p className="mt-4 text-cocoa-soft">{copy.enquiryText}</p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm
                subject={pup.named ? pup.name : `the ${pup.breed}`}
                defaultMessage={copy.defaultMessage}
              />
            </div>
          </section>

          <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
            <Neighbour pup={prev} label="Previous pup" />
            <Neighbour pup={next} label="Next pup" last />
          </nav>
        </div>
      </article>
    </RevealScope>
  );
}
