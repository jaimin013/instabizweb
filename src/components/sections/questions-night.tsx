import type { CSSProperties } from "react";
import { PupAnchor } from "@/components/pup/pup-layer";
import { ButtonLink } from "@/components/ui/button";
import { homeNotes } from "@/data/faq";

/** Left/top (%), size (px) and stagger of each twinkling star. */
const stars = [
  [8, 12, 16.2],
  [22, 30, 9],
  [41, 8, 12.6],
  [57, 22, 8.1],
  [72, 6, 14.4],
  [88, 18, 10.8],
  [95, 42, 9],
  [4, 58, 10.8],
  [34, 70, 7.2],
  [63, 84, 9.9],
  [83, 66, 12.6],
] as const;

const STAR =
  "M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z";

/** "Questions, answered": a few common questions under a starry night, with Teddy puzzling over them. */
export function QuestionsNight() {
  return (
    <section data-pup-lane="" aria-labelledby="questions-title" className="night theme-cocoa">
      <div aria-hidden="true" className="night-stars">
        {stars.map(([x, y, size], i) => (
          <svg
            key={i}
            viewBox="0 0 40 40"
            className="twinkle absolute text-honey"
            style={
              { left: `${x}%`, top: `${y}%`, width: size, animationDelay: `${i * 0.4}s` } as CSSProperties
            }
          >
            <path d={STAR} fill="currentColor" />
          </svg>
        ))}
      </div>

      <div className="night-grid container-wide">
        <div className="night-intro">
          <h2 id="questions-title" className="text-huge">
            Questions, answered
          </h2>
          <ButtonLink href="/faq" variant="ghost" className="night-cta">
            Read all questions
          </ButtonLink>
          <div className="night-pup">
            <span aria-hidden="true" className="night-wonder font-plush">
              ?
            </span>
            <PupAnchor id="night" pose="sit" act="tilt" fit="foot" className="night-teddy" />
          </div>
        </div>

        <dl className="night-list">
          {homeNotes.map((note) => (
            <div key={note.q} className="qa">
              <dt className="qa-q font-plush">
                <svg viewBox="0 0 40 40" className="qa-star" aria-hidden="true">
                  <path d={STAR} fill="currentColor" />
                </svg>
                {note.q}
              </dt>
              <dd className="qa-a">{note.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
