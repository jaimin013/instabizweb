import Image from "next/image";
import { PupAnchor } from "@/components/pup/pup-layer";
import { ButtonLink } from "@/components/ui/button";
import { getPuppy } from "@/data/puppies";
import { whatsappLink } from "@/lib/site";

/** "Ready to meet your new best friend?": a little house whose door swings open as you scroll to it. */
export function ClosingHouse() {
  const max = getPuppy("maltipoo-max-male");

  return (
    <section data-pup-lane="" aria-labelledby="cta-title" className="closing theme-cocoa">
      <div className="closing-copy container-wide">
        <h2 id="cta-title" className="text-huge">
          Ready to meet your new best friend?
        </h2>
        <p className="closing-lede">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We
          help you find the right match and ensure a smooth, safe delivery across the UAE.
        </p>
      </div>

      <div className="house">
        <span aria-hidden="true" className="house-plant house-plant--left" />
        <span aria-hidden="true" className="house-lamp" />
        <div className="house-doorway">
          <span className="house-inside">
            {max && (
              <Image
                src={max.photo.src}
                alt="Max, waiting inside"
                fill
                sizes="16rem"
                className="object-cover"
                style={{ objectPosition: "53.8% 44.3%" }}
              />
            )}
          </span>
          <span aria-hidden="true" className="house-door">
            <span className="house-peep" />
            <span className="house-knob" />
          </span>
        </div>
        <span aria-hidden="true" className="house-plant house-plant--right" />
        <span aria-hidden="true" className="house-mat font-hand">
          welcome home
        </span>
        <PupAnchor id="house" pose="bow" fit="foot" className="house-teddy" />
      </div>

      <div className="closing-actions container-wide">
        <ButtonLink href={whatsappLink()} variant="whatsapp">
          Enquire on WhatsApp
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          Visit &amp; contact
        </ButtonLink>
      </div>
    </section>
  );
}
