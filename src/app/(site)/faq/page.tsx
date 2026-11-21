import type { Metadata } from "next";
import { FaqBoard } from "@/components/pages/faq-board";

export const metadata: Metadata = {
  title: "Questions & answers",
  description: "Answers about vaccinations, meeting a puppy, importing from Korea and delivery.",
};

export default function FaqPage() {
  return (
    <section aria-labelledby="faq-title" className="faqroom theme-cocoa">
      <div className="relative mx-auto w-full max-w-[110rem] px-(--gutter) pt-10 pb-24 md:pt-16">
        <header className="max-w-4xl">
          <h1 id="faq-title" className="text-giant">
            Questions &amp; answers
          </h1>
          <p className="mt-6 max-w-[52ch] text-lede text-ink-soft">
            Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is available 24/7.
          </p>
        </header>
        <div className="mt-12 md:mt-16">
          <FaqBoard />
        </div>
      </div>
    </section>
  );
}
