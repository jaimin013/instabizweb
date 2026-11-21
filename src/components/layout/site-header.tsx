"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/layout/nav-link";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ButtonLink } from "@/components/ui/button";
import { useHeaderVisibility } from "@/hooks/use-header-visibility";
import { isActive, mainNav, site, whatsappLink } from "@/lib/site";

/**
 * Fixed top bar.
 *  - Home: transparent over the hero until the page scrolls, so the sun glow shows through.
 *  - Other pages: solid from the start.
 *  - Slides away while scrolling down, returns on scroll up or keyboard focus.
 *  - The bottom edge is a scalloped "hem" like a tablecloth.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { scrolled, hidden, reveal } = useHeaderVisibility();
  const solid = pathname !== "/";

  return (
    <header
      id="site-header"
      data-scrolled={scrolled}
      data-hidden={hidden}
      data-solid={solid}
      onFocusCapture={reveal}
      className="group/header fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-silk before:absolute before:inset-0 before:bg-milk before:opacity-0 before:transition-opacity before:duration-[350ms] data-[hidden=true]:-translate-y-[120%] data-[scrolled=true]:before:opacity-100 data-[solid=true]:before:opacity-100"
    >
      <div className="relative container-wide flex h-(--header-h) items-center gap-6">
        <Link
          href="/"
          aria-label={`${site.legalName} — home`}
          className="group/brand flex flex-none items-center gap-3 rounded-pill"
        >
          <Image
            src="/brand/logo.png"
            alt=""
            width={56}
            height={56}
            loading="eager"
            fetchPriority="high"
            className="size-[2.6rem] transition-[rotate] duration-[600ms] ease-pounce group-hover/brand:-rotate-8 md:size-12"
          />
          <span className="inline font-plush text-[clamp(1.15rem,4.6vw,1.4rem)] leading-none lg:hidden xl:inline xl:text-[1.4rem]">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-[clamp(1.25rem,2.3vw,2.4rem)]">
            {mainNav.map(({ href, label }) => (
              <li key={href}>
                <NavLink href={href} label={label} active={isActive(pathname, href)} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <ButtonLink
            href={whatsappLink()}
            variant="whatsapp"
            className="hidden min-h-11 px-[1.35rem] py-[0.6rem] text-[0.95rem] md:inline-flex"
          >
            WhatsApp us
          </ButtonLink>
          <MobileMenu pathname={pathname} />
        </div>
      </div>

      {/* Scalloped hem. Hidden while the header is transparent over the hero. */}
      <svg
        aria-hidden="true"
        width="100%"
        height="14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-[calc(100%-1px)] left-0 block opacity-0 drop-shadow-[0_4px_4px_rgb(42_23_14/0.08)] transition-opacity duration-[350ms] group-data-[scrolled=true]/header:opacity-100 group-data-[solid=true]/header:opacity-100"
      >
        <defs>
          <pattern id="hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="fill-milk" />
            <path d="M0 2A22 11 0 0 0 44 2" className="fill-none stroke-cocoa/15" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#hem)" />
      </svg>
    </header>
  );
}
