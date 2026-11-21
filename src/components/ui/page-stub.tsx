import { ButtonLink } from "@/components/ui/button";

/** Temporary body for routes that are built in a later phase. */
export function PageStub({ title, note }: { title: string; note: string }) {
  return (
    <div className="container-site flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="font-hand text-note text-accent-ink">coming soon</p>
      <h1 className="mt-3 text-display">{title}</h1>
      <p className="mt-4 max-w-[44ch] text-lede text-ink-soft">{note}</p>
      <ButtonLink href="/" variant="ghost" className="mt-8">
        Back home
      </ButtonLink>
    </div>
  );
}
