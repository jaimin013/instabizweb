import Image from "next/image";
import Link from "next/link";
import { FooterBasket } from "@/components/layout/footer-basket";
import { footerNav, site, socials, whatsappLink } from "@/lib/site";

/** Position + size (px) + stagger for each twinkling star. */
const stars = [
  { x: 6, y: 18, size: 13 },
  { x: 14, y: 42, size: 8 },
  { x: 23, y: 12, size: 10 },
  { x: 31, y: 30, size: 7 },
  { x: 44, y: 9, size: 11 },
  { x: 52, y: 36, size: 8 },
  { x: 63, y: 15, size: 10 },
  { x: 71, y: 40, size: 7 },
  { x: 92, y: 33, size: 8 },
] as const;

const linkClass = "font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline";

/**
 * Dark "night" band. `theme-cocoa` re-scopes the semantic tokens so the
 * shared Button/ink/line utilities adapt without extra classes.
 */
export function SiteFooter() {
  return (
    <footer className="theme-cocoa relative bg-[#24130b] pb-[calc(var(--bar-h)+2rem)] text-ink md:pb-10">
      {/* Rolling hill that lifts the footer's top edge. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[calc(100%-1px)] h-[clamp(2.5rem,5vw,5rem)] w-full fill-[#24130b]"
      >
        <path d="M0 80V50C180 8 360 8 540 38S900 76 1080 40 1320 6 1440 30V80Z" />
      </svg>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 h-64 overflow-hidden">
        {stars.map(({ x, y, size }, i) => (
          <svg
            key={i}
            viewBox="0 0 40 40"
            className="twinkle absolute text-honey"
            style={{ left: `${x}%`, top: `${y}%`, width: size, animationDelay: `${i * 0.4}s` }}
          >
            <path
              d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z"
              fill="currentColor"
            />
          </svg>
        ))}
        <span className="moon" />
      </div>

      {/* Phase 5: Teddy-in-his-basket scene sits in the empty left column below the blurb. */}
      <div className="relative container-wide grid gap-12 pt-20 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:pt-28">
        <div className="md:col-span-5">
          <p className="font-plush text-big text-honey-soft">Home, at last.</p>
          <p className="mt-5 max-w-md text-ink-soft">{site.about}</p>
        </div>

        <div className="order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
          <FooterBasket />
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1">
          <h2 className="font-hand text-lg font-normal text-honey">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {footerNav.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3 md:row-span-2 md:row-start-1">
          <h2 className="font-hand text-lg font-normal text-honey">Say hello</h2>
          <ul className="mt-4 space-y-2.5 text-milk/90">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-honey"
              >
                WhatsApp {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="break-all hover:text-honey">
                {site.email}
              </a>
            </li>
            <li>{site.address}</li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="Social media">
            {socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center rounded-pill border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative container-wide mt-16 flex flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
        <span className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="" width={36} height={36} className="size-9" />© {site.buildYear}{" "}
          {site.legalName}
        </span>
        <span className="font-hand text-base text-honey/80">{site.motto}</span>
      </div>
    </footer>
  );
}
