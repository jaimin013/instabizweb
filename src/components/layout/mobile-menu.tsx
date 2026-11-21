"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { PawIcon } from "@/components/icons/paw";
import { ButtonLink } from "@/components/ui/button";
import { isActive, mainNav, site, whatsappLink } from "@/lib/site";

/**
 * Full-screen menu built on the native <dialog> element, which gives us
 * for free: top-layer stacking, a focus trap, inert background, Esc to
 * close and correct screen-reader semantics. We only add the animation:
 * on close we set `data-closing`, wait for the exit animation to finish,
 * then call dialog.close().
 */
export function MobileMenu({ pathname }: { pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.removeAttribute("data-closing");
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    setOpen(true);
  }, []);

  const closeMenu = useCallback((immediate = false) => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || dialog.hasAttribute("data-closing")) return;
    if (immediate) return dialog.close();

    dialog.setAttribute("data-closing", "");

    // Not `{ once: true }`: the menu links' own animations bubble up to the
    // dialog and would consume a one-shot listener before the exit animation
    // ends, leaving the menu stuck open. Remove it only for the dialog's event.
    const finish = () => {
      window.clearTimeout(fallback);
      dialog.removeEventListener("animationend", onEnd);
      dialog.removeAttribute("data-closing");
      dialog.close();
    };
    const onEnd = (event: AnimationEvent) => {
      if (event.target === dialog) finish();
    };
    dialog.addEventListener("animationend", onEnd);
    // Safety net if the animation never runs (e.g. tab hidden, animations disabled).
    const fallback = window.setTimeout(finish, 700);
  }, []);

  // Wire native dialog events once.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = (event: Event) => {
      event.preventDefault(); // Esc: play the exit animation instead of snapping shut
      closeMenu();
    };
    const onClose = () => {
      document.documentElement.style.overflow = "";
      setOpen(false);
    };

    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, [closeMenu]);

  // Rotating a tablet or resizing past `lg` swaps to the desktop nav.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => event.matches && closeMenu(true);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [closeMenu]);

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-pill border-2 border-line bg-surface px-4 text-[0.95rem] font-semibold text-ink transition-transform duration-300 ease-pounce active:scale-95 lg:hidden"
      >
        <PawIcon className="size-4" />
        Menu
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        data-lenis-prevent
        className="menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
      >
        <div className="flex h-full flex-col px-(--gutter) pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <span className="font-hand text-lg">where to, friend?</span>
            <button
              type="button"
              onClick={() => closeMenu()}
              className="h-11 rounded-pill bg-cocoa px-5 font-semibold text-milk transition-transform duration-300 ease-pounce active:scale-95"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {mainNav.map(({ href, label }, i) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => closeMenu()}
                      aria-current={active ? "page" : undefined}
                      data-active={active}
                      style={{ "--i": i } as CSSProperties}
                      className="menu-link group/link block py-2 font-display text-[clamp(2.4rem,11vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.02em] data-[active=true]:text-toffee-deep"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-3">
            <ButtonLink href={whatsappLink()} variant="whatsapp" className="w-full">
              WhatsApp us
            </ButtonLink>
            <p className="text-center text-sm font-medium">{site.phoneDisplay}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
