import Link from "next/link";
import { PawIcon } from "@/components/icons/paw";

/**
 * Desktop nav item. A small paw "stamps" under the current page and
 * ghosts in on hover. Purely CSS-driven via the `data-active` hook.
 */
export function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      data-active={active}
      aria-current={active ? "page" : undefined}
      className="group/link relative inline-flex px-0.5 py-[0.55rem] text-base font-[620] whitespace-nowrap text-ink transition-colors hover:text-toffee-ink data-[active=true]:text-toffee-deep"
    >
      <span>{label}</span>
      <PawIcon className="pointer-events-none absolute -bottom-[0.45rem] left-1/2 size-[0.8rem] -translate-x-1/2 scale-40 -rotate-10 text-toffee opacity-0 transition-[opacity,scale] duration-[250ms,450ms] ease-[ease,var(--ease-pounce)] group-hover/link:scale-100 group-hover/link:opacity-45 group-data-[active=true]/link:scale-100 group-data-[active=true]/link:opacity-100" />
    </Link>
  );
}
