import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false },
};

const palette = [
  { group: "Browns", colors: ["toffee", "toffee-deep", "toffee-ink", "cocoa", "cocoa-soft"] },
  { group: "Yellows", colors: ["honey", "honey-soft"] },
  { group: "Accents", colors: ["blush", "sky", "sky-deep", "cherry", "whatsapp"] },
  { group: "Paper", colors: ["milk", "cream", "cream-soft"] },
];

const type = [
  { token: "text-hero", className: "font-display heading-wonk text-hero", sample: "Teacup" },
  { token: "text-display", className: "font-display text-display", sample: "Meet the pups" },
  { token: "text-title", className: "font-display text-title", sample: "Your puppy journey" },
  {
    token: "text-note",
    className: "font-hand-bouncy text-note text-accent-ink",
    sample: "every puppy is family",
  },
  { token: "text-lede", className: "text-lede text-ink-soft", sample: "Real puppies, real photos." },
  { token: "body", className: "", sample: "Figtree body copy at 17px / 1.6 line-height." },
];

const shadows = ["shadow-sticker-sm", "shadow-sticker", "shadow-sticker-lg", "shadow-press"];

/** Living reference for every token, used to check the system visually. */
export default function DesignSystemPage() {
  return (
    <div className="container-site space-y-20 py-16">
      <header>
        <p className="font-hand text-note text-accent-ink">TeddyPups</p>
        <h1 className="text-display">Design system</h1>
      </header>

      <section aria-labelledby="ds-color">
        <h2 id="ds-color" className="text-title">
          Colour
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {palette.map(({ group, colors }) => (
            <div key={group}>
              <h3 className="mb-3 font-sans text-sm font-semibold tracking-wide uppercase">{group}</h3>
              <ul className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <li key={c} className="w-24 text-sm">
                    <span
                      className="block h-16 rounded-2xl border-2 border-cocoa"
                      style={{ background: `var(--color-${c})` }}
                    />
                    <code className="mt-1 block">{c}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="ds-type">
        <h2 id="ds-type" className="text-title">
          Type
        </h2>
        <ul className="mt-8 space-y-6">
          {type.map(({ token, className, sample }) => (
            <li
              key={token}
              className="grid gap-2 border-b border-cocoa/15 pb-6 md:grid-cols-[10rem_1fr] md:items-baseline"
            >
              <code className="text-sm text-ink-soft">{token}</code>
              <span className={className}>{sample}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ds-buttons">
        <h2 id="ds-buttons" className="text-title">
          Buttons
        </h2>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="whatsapp">WhatsApp us</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="theme-cocoa mt-6 flex flex-wrap gap-4 rounded-card bg-surface p-8 text-ink">
          <Button>Primary on cocoa</Button>
          <Button variant="ghost">Ghost on cocoa</Button>
        </div>
      </section>

      <section aria-labelledby="ds-shape">
        <h2 id="ds-shape" className="text-title">
          Shape &amp; shadow
        </h2>
        <div className="mt-8 flex flex-wrap items-end gap-8">
          {shadows.map((s) => (
            <div key={s} className="text-center text-sm">
              <div className={`size-28 rounded-card border-2 border-cocoa bg-honey-soft ${s}`} />
              <code className="mt-3 block">{s}</code>
            </div>
          ))}
          <div className="text-center text-sm">
            <div className="h-36 w-28 arch border-3 border-cocoa bg-blush" />
            <code className="mt-3 block">arch</code>
          </div>
        </div>
      </section>
    </div>
  );
}
