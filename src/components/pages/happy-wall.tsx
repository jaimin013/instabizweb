"use client";

import type { CSSProperties } from "react";
import { Polaroid } from "@/components/gallery/polaroid";
import { PhotoViewer, useViewer } from "@/components/gallery/photo-viewer";
import { TeddyActor } from "@/components/mascot/teddy-actor";
import { RevealScope } from "@/components/ui/reveal-scope";
import { wall } from "@/data/wall";

/** /happy-families: the whole wall of customer photos, opening full-screen on click. */
export function HappyWall() {
  const viewer = useViewer(wall.length);

  return (
    <section aria-labelledby="families-title" className="memories">
      <RevealScope>
        <div className="mx-auto w-full max-w-[110rem] px-(--gutter) pt-10 pb-24 md:pt-16">
          <div className="memories-head">
            <div>
              <p className="font-hand text-lg text-toffee-ink" data-reveal>
                our wall of happy endings
              </p>
              <h1 id="families-title" className="memories-title text-giant" data-reveal>
                Happy families
                <svg viewBox="0 0 32 32" className="memories-heart" aria-hidden="true">
                  <path
                    d="M16 28C5 20.5 2.5 14.5 2.5 10c0-4 3-6.5 6.6-6.5 3 0 5.2 1.6 6.9 4.2 1.7-2.6 3.9-4.2 6.9-4.2 3.6 0 6.6 2.5 6.6 6.5 0 4.5-2.5 10.5-13.5 18z"
                    fill="currentColor"
                  />
                </svg>
              </h1>
              <p className="mt-6 max-w-[50ch] text-lede text-cocoa-soft" data-reveal>
                Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful
                moments shared by our amazing clients after welcoming their furry friends.
              </p>
              <p className="mt-5 font-hand text-lg text-toffee-ink" data-reveal>
                {wall.length} moments and counting
              </p>
            </div>

            <figure className="memories-note" data-reveal>
              <span
                aria-hidden="true"
                className="tape tape--center"
                style={{ "--tape": "#cfe5f6" } as CSSProperties}
              />
              <blockquote className="font-plush-text">
                “TeddyPups truly made our dream a reality. They supported us at every step of the import
                journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support
                throughout the process gave us complete peace of mind.”
              </blockquote>
              <figcaption className="font-hand">Sarah M., Dubai, UAE</figcaption>
            </figure>
          </div>

          <div className="mt-16 md:mt-20">
            <ul className="wall" aria-label="Photos from TeddyPups families">
              {wall.map((photo, i) => (
                <li
                  key={photo.n}
                  className="wall-item"
                  data-reveal
                  style={{ "--d": `${photo.delay}ms` } as CSSProperties}
                >
                  <button
                    type="button"
                    className="wall-print"
                    aria-label={`Open photo ${photo.n} of ${wall.length}${photo.caption ? `: ${photo.caption}` : ""}`}
                    onClick={() => viewer.open(i)}
                  >
                    <Polaroid
                      photo={photo}
                      tilt={photo.tilt}
                      tape={photo.tape}
                      tapes={photo.tapes}
                      index={i}
                      sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
                    />
                    <svg viewBox="0 0 64 64" className="wall-paw" aria-hidden="true" fill="currentColor">
                      <path d="M32 31c-7.4 0-15 8-15 15 0 5.2 4 8 8.8 8 2.6 0 4.6-1.1 6.2-1.1s3.6 1.1 6.2 1.1c4.8 0 8.8-2.8 8.8-8 0-7-7.6-15-15-15z" />
                      <ellipse cx="14.6" cy="29.2" rx="4.6" ry="6" transform="rotate(-28 14.6 29.2)" />
                      <ellipse cx="24.2" cy="16.6" rx="5" ry="6.6" transform="rotate(-10 24.2 16.6)" />
                      <ellipse cx="39.8" cy="16.6" rx="5" ry="6.6" transform="rotate(10 39.8 16.6)" />
                      <ellipse cx="49.4" cy="29.2" rx="4.6" ry="6" transform="rotate(28 49.4 29.2)" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="memories-foot">
            <div className="aspect-[300/240] w-36 md:w-44">
              <TeddyActor params={{ sit: 1, facing: -1 }} />
            </div>
            <p className="font-hand text-lg text-cocoa-soft">every one of them was a Teddy Pup once</p>
          </div>
        </div>
      </RevealScope>

      <PhotoViewer photos={wall} viewer={viewer} />
    </section>
  );
}
