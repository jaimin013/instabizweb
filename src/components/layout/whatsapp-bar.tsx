import { ButtonLink } from "@/components/ui/button";
import { site, whatsappLink } from "@/lib/site";

/**
 * Thumb-reach call to action, phones only. Its height is published as
 * `--bar-h` (tokens.css) so the footer can pad itself clear of it.
 */
export function WhatsAppBar() {
  return (
    <div
      data-whatsapp-bar
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-surface px-3 pt-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="mx-auto flex max-w-md gap-2">
        <ButtonLink href={whatsappLink()} variant="whatsapp" className="min-h-12 flex-1 shadow-none">
          WhatsApp us
        </ButtonLink>
        <ButtonLink href={`tel:${site.phone}`} variant="ghost" className="min-h-12 px-5">
          Call
        </ButtonLink>
      </div>
    </div>
  );
}
