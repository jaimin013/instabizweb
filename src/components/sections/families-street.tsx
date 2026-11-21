"use client";

import type { CSSProperties } from "react";
import { Polaroid } from "@/components/gallery/polaroid";
import { PhotoViewer, useViewer } from "@/components/gallery/photo-viewer";
import { PupAnchor } from "@/components/pup/pup-layer";
import { ButtonLink } from "@/components/ui/button";
import { RevealScope } from "@/components/ui/reveal-scope";
import { homeWall, wall, wallPhoto } from "@/data/wall";

/**
 * "Happy families & puppies": dusk falls on the shop front. A customer's note hangs above a wall of
 * taped-up photos; below it, the shop door, a street lamp and Teddy waiting on the pavement.
 */
export function FamiliesStreet() {
  const viewer = useViewer(wall.length);

  return (
    <section data-pup-lane="" aria-labelledby="dusk-title" className="dusk theme-cocoa">
      <div className="dusk-sky container-wide">
        <div className="dusk-head">
          <h2 id="dusk-title" className="text-huge">
            Happy families &amp; puppies
          </h2>
          <p className="mt-5 max-w-[50ch] text-lede text-ink-soft">
            We are truly honored to see our puppies become cherished members of loving families. These
            heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their
            homes and hearts.
          </p>
        </div>
        <figure className="dusk-note">
          <blockquote className="font-plush-text">
            “TeddyPups truly made our dream a reality. They supported us at every step of the import journey.
            Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the
            process gave us complete peace of mind.”
          </blockquote>
          <figcaption className="font-hand">Sarah M., Dubai, UAE</figcaption>
        </figure>
      </div>

      <div className="photowall">
        <div className="photowall-wall">
          <RevealScope>
            <ul className="photowall-prints" aria-label="Photos from TeddyPups families">
              {homeWall.map((print, i) => {
                const photo = wallPhoto(print.n);
                if (!photo) return null;
                return (
                  <li key={print.n} data-reveal style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                    <button
                      type="button"
                      className="photowall-print"
                      aria-label={`Open photo ${photo.n} of ${wall.length}${photo.caption ? `: ${photo.caption}` : ""}`}
                      onClick={() => viewer.open(photo.n - 1)}
                    >
                      <Polaroid
                        photo={photo}
                        tilt={print.tilt}
                        tape={print.tape}
                        tapes={print.tapes}
                        index={i}
                        layout="cropped"
                        sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </RevealScope>

          <div className="facade-ground">
            <span aria-hidden="true" className="facade-door" />
            <span aria-hidden="true" className="lamp">
              <span className="lamp-light" />
            </span>
            <ButtonLink href="/happy-families" className="facade-cta">
              See every happy family
            </ButtonLink>
            <PupAnchor id="families" pose="sit" fit="foot" className="dusk-teddy" />
          </div>
        </div>
        <div aria-hidden="true" className="street-pavement" />
      </div>

      <PhotoViewer photos={wall} viewer={viewer} />
    </section>
  );
}
