import { PupProvider } from "@/components/pup/pup-layer";
import { EyeTracker } from "@/components/effects/eye-tracker";
import { PawTrail } from "@/components/effects/paw-trail";
import { PageCurtain } from "@/components/layout/page-curtain";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppBar } from "@/components/layout/whatsapp-bar";

/** Shell shared by every public page: header, <main>, footer, mobile CTA bar. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <PupProvider>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-pill bg-cocoa px-5 py-3 font-semibold text-milk transition-transform focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="relative flex flex-1 flex-col pt-(--header-h) outline-none">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppBar />
      <PawTrail />
      <EyeTracker />
      <PageCurtain />
    </PupProvider>
  );
}
