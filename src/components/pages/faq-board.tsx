"use client";

import { useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { TeddyActor } from "@/components/mascot/teddy-actor";
import { ButtonLink } from "@/components/ui/button";
import { RevealScope } from "@/components/ui/reveal-scope";
import { notes } from "@/data/faq";
import { whatsappLink } from "@/lib/site";

/** Wrap each occurrence of `query` in <mark> so a search hit is easy to spot. */
function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text
    .split(new RegExp(`(${escaped})`, "ig"))
    .map((part, i) => (part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part));
}

/** /faq: a corkboard of notes. Search filters them; clicking a note unfolds its answer. */
export function FaqBoard() {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const term = query.trim();
  const visible = useMemo(() => {
    const t = term.toLowerCase();
    return notes
      .map((note, index) => ({ note, index }))
      .filter(({ note }) => !t || note.q.toLowerCase().includes(t) || note.a.toLowerCase().includes(t));
  }, [term]);

  const count = visible.length === 1 ? "1 note on the board" : `${visible.length} notes on the board`;

  return (
    <div className="notes" data-open={open !== null ? "" : undefined}>
      <aside className="notes-side" aria-label="Find a question">
        <label htmlFor={searchId} className="notes-label font-hand">
          sniff out a question
        </label>
        <div className="notes-search">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="notes-lens">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={searchId}
            type="search"
            placeholder="delivery, Korea, vaccinated…"
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(null);
            }}
          />
        </div>
        <p className="notes-count" aria-live="polite">
          {term && visible.length === 0 ? "no notes found" : count}
        </p>

        <div className="notes-teddy">
          <span aria-hidden="true" className="notes-bubble font-plush">
            <span className="notes-q">?</span>
            <span className="notes-a">!</span>
          </span>
          <div className="aspect-[300/240]">
            <TeddyActor params={{ sit: 1, tilt: 8 }} />
          </div>
        </div>

        <ButtonLink href={whatsappLink()} variant="whatsapp" className="notes-ask">
          Ask your own question
        </ButtonLink>
      </aside>

      <div className="notes-board">
        <RevealScope key={term}>
          <ul className="notes-list">
            {visible.map(({ note, index }, i) => {
              const unfolded = open === index;
              return (
                <li
                  key={note.q}
                  className="note"
                  data-reveal
                  data-unfolded={unfolded ? "" : undefined}
                  style={{ "--tilt": `${note.tilt}deg`, "--pin": note.pin, "--i": i } as CSSProperties}
                >
                  <span aria-hidden="true" className="note-pin" />
                  <h2 className="note-q">
                    <button
                      type="button"
                      id={`q-${index}`}
                      aria-expanded={unfolded}
                      aria-controls={`a-${index}`}
                      onClick={() => setOpen(unfolded ? null : index)}
                    >
                      <span className="font-plush-text">{highlight(note.q, term)}</span>
                      <span aria-hidden="true" className="note-chevron" />
                    </button>
                  </h2>
                  <div
                    id={`a-${index}`}
                    role="region"
                    aria-labelledby={`q-${index}`}
                    className="note-answer"
                    inert={!unfolded}
                  >
                    <div className="note-flap">
                      <p>{highlight(note.a, term)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
            {term && visible.length === 0 && (
              <li className="note note--empty">
                <p className="font-plush-text">
                  No notes match “{term}”. Try another word, or ask us on WhatsApp, we love questions.
                </p>
              </li>
            )}
          </ul>
        </RevealScope>
      </div>
    </div>
  );
}
