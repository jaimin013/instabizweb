import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ContactLetter } from "@/components/pages/contact-letter";
import { ButtonLink } from "@/components/ui/button";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit & contact",
  description:
    "Questions about our puppies or the adoption process? Write us a letter, message us on WhatsApp or visit the Downtown Dubai showroom.",
};

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Downtown Dubai, United Arab Emirates")}`;

export default function ContactPage() {
  return (
    <section
      aria-labelledby="contact-title"
      className="tp-scene"
      style={{ "--sky-top": "#fff9ee", "--sky-bottom": "#f9dca4" } as CSSProperties}
    >
      <div className="mx-auto max-w-[110rem] px-(--gutter) pt-10 pb-24 md:pt-16">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h1 id="contact-title" className="max-w-[12ch] font-plush text-giant lg:col-span-7">
            Get in touch with us
          </h1>
          <p className="text-lede text-ink-soft lg:col-span-5 lg:pb-3">
            Have questions about our puppies or adoption process? Fill out the form, and our team will get
            back to you promptly. Whether ready to adopt or just seeking info, we&apos;d love to hear from
            you!
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <ContactLetter />
          </div>

          <div className="lg:col-span-5 lg:row-start-1">
            <ButtonLink href={whatsappLink()} variant="whatsapp" className="w-full sm:w-auto">
              WhatsApp {site.phoneDisplay}
            </ButtonLink>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="font-hand-bouncy text-ink-soft">call us</dt>
                <dd className="mt-1 text-lg font-semibold">
                  <a className="link-ink" href={`tel:${site.phone}`}>
                    {site.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-hand-bouncy text-ink-soft">email</dt>
                <dd className="mt-1 text-lg font-semibold break-all">
                  <a className="link-ink" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
              <svg
                viewBox="0 0 300 90"
                aria-hidden="true"
                className="absolute right-0 -bottom-1 w-3/4 text-toffee/30"
                fill="currentColor"
              >
                <path d="M0 90V58h22V40h18v18h14V24h20v34h16V46h24v12h18V30h22v28h16V16h20v42h18V50h26v40z" />
              </svg>
              <div className="tp-visit relative p-7 pt-6">
                <div>
                  <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                    Visit us in Downtown Dubai
                  </h2>
                  <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                    Step into our Downtown Dubai showroom and experience the joy of choosing your puppy
                    face-to-face.
                  </p>
                  <p className="mt-4 flex items-center gap-2 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-5 shrink-0 text-toffee-deep"
                      fill="currentColor"
                    >
                      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.500A2.500 2.500 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5z" />
                    </svg>
                    {site.address}
                  </p>
                  <ButtonLink href={mapsLink} variant="ghost" className="mt-6 bg-milk!">
                    Open in Google Maps
                  </ButtonLink>
                </div>
                <figure className="tp-visit__photo">
                  <Image
                    src="/puppies/showroom-4.jpg"
                    alt="The apricot teddy bear puppy from our showroom, held up to say hello"
                    fill
                    sizes="(min-width: 640px) 11rem, 90vw"
                    className="object-cover"
                    style={{ objectPosition: "45.3% 44.4%" }}
                  />
                </figure>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
