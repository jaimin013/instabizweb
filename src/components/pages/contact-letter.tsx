"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { PawIcon } from "@/components/icons/paw";
import { TeddyActor } from "@/components/mascot/teddy-actor";
import { Button, ButtonLink } from "@/components/ui/button";
import { listings } from "@/data/listing";
import { whatsappLink } from "@/lib/site";

/**
 * /contact: the enquiry is a fill-in-the-blank letter.
 *
 *   writing → the form
 *   sealing → the letter folds up into an envelope (0.65s)
 *   posting → the envelope drops into a post box and its flag goes up
 *   sent    → thank-you card, with a button to carry on in WhatsApp
 *
 * There is no backend: "posting" is the finished state, and WhatsApp is where the team answers,
 * so the thank-you card offers the same message pre-filled there.
 */
type Phase = "writing" | "sealing" | "posting" | "sent";
type Fields = { name: string; phone: string; email: string; area: string; puppy: string; message: string };

const EMPTY: Fields = { name: "", phone: "", email: "", area: "", puppy: "", message: "" };

const options = listings.map((l) => ({
  value: l.slug,
  label: `${l.name} (${l.meta.split(" · ").slice(0, -1).join(", ") || l.meta})`,
}));

function problems(f: Fields) {
  const found: { field: keyof Fields; text: string }[] = [];
  if (f.name.trim().length < 2) found.push({ field: "name", text: "Your name (at least 2 letters)" });
  if (f.phone.replace(/\D/g, "").length < 7)
    found.push({ field: "phone", text: "A phone or WhatsApp number we can reach" });
  if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim()))
    found.push({ field: "email", text: "An email that looks right, or leave it blank" });
  return found;
}

function whatsappText(f: Fields) {
  const pick = options.find((o) => o.value === f.puppy);
  return [
    `Hi TeddyPups! My name is ${f.name.trim()}.`,
    pick ? `I'm curious about ${pick.label}.` : "I'd like to know more about your puppies.",
    f.area.trim() ? `I live in ${f.area.trim()}.` : "",
    f.message.trim(),
  ]
    .filter(Boolean)
    .join(" ");
}

function Envelope() {
  return (
    <svg viewBox="0 0 176 124" className="tp-post__envelope" aria-hidden="true">
      <rect x="4" y="14" width="168" height="106" rx="8" fill="#fff6df" stroke="#2a170e" strokeWidth="3.5" />
      <path
        d="M8 118L68 66M168 118L108 66"
        stroke="#2a170e"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".5"
        fill="none"
      />
      <path
        className="tp-post__flap"
        d="M6 17L88 78L170 17Z"
        fill="#fbe3b4"
        stroke="#2a170e"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <g transform="translate(128 78)">
        <rect
          width="34"
          height="34"
          rx="5"
          fill="#fbe3b4"
          stroke="#a24a1a"
          strokeWidth="2.4"
          strokeDasharray="4 3"
        />
        <PawIcon x={7} y={6} width={20} height={20} fill="#a24a1a" />
      </g>
    </svg>
  );
}

function PostBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 190" className={className} aria-hidden="true">
      <rect x="66" y="120" width="18" height="66" fill="#a24a1a" stroke="#2a170e" strokeWidth="3.5" />
      <rect
        x="22"
        y="26"
        width="106"
        height="100"
        rx="46"
        fill="#c2622b"
        stroke="#2a170e"
        strokeWidth="3.5"
      />
      <rect x="22" y="76" width="106" height="50" fill="#c2622b" stroke="#2a170e" strokeWidth="3.5" />
      <rect x="42" y="68" width="66" height="9" rx="4.5" fill="#2a170e" />
      <g className="tp-post__flag">
        <rect x="124" y="40" width="5" height="46" fill="#2a170e" />
        <path d="M129 40h24v16h-24z" fill="#f2be6b" stroke="#2a170e" strokeWidth="3" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Blank({ size, children }: { size: string; children: React.ReactNode }) {
  return (
    <span className="tp-blank" style={{ "--size": size } as CSSProperties}>
      {children}
    </span>
  );
}

export function ContactLetter() {
  const selectId = useId();
  const messageId = useId();
  const [phase, setPhase] = useState<Phase>("writing");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<{ field: keyof Fields; text: string }[]>([]);
  const sentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);
  useEffect(() => {
    if (phase === "sent") sentRef.current?.focus();
  }, [phase]);

  const set = (key: keyof Fields) => (event: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [key]: event.target.value }));
    if (errors.some((e) => e.field === key)) setErrors((list) => list.filter((e) => e.field !== key));
  };
  const invalid = (key: keyof Fields) => (errors.some((e) => e.field === key) ? true : undefined);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    // The hidden "website" field is a honey-pot: only bots fill it. Act sent, send nothing.
    const bot = String(form.get("website") ?? "") !== "";
    const found = problems(fields);
    if (!bot && found.length) {
      setErrors(found);
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${found[0].field === "puppy" ? "puppyId" : found[0].field}"]`)
        ?.focus();
      return;
    }
    setErrors([]);
    setPhase("sealing");
    timers.current.push(
      window.setTimeout(() => setPhase("posting"), 650),
      window.setTimeout(() => setPhase("sent"), 1900),
    );
  };

  const again = () => {
    setFields(EMPTY);
    setPhase("writing");
  };

  if (phase === "sent") {
    return (
      <div className="tp-post" data-phase="sent">
        <div ref={sentRef} tabIndex={-1} className="tp-post__sent" role="status">
          <PostBox className="tp-post__box--sent" />
          <h2 className="mt-4 font-plush text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">Letter posted!</h2>
          <p className="mx-auto mt-3 max-w-[40ch] text-cocoa-soft">
            Thank you{fields.name.trim() ? `, ${fields.name.trim().split(" ")[0]}` : ""}. Our team replies
            fastest on WhatsApp, so you can carry on the conversation there right now.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href={whatsappLink(whatsappText(fields))} variant="whatsapp">
              Continue on WhatsApp
            </ButtonLink>
            <Button variant="ghost" onClick={again}>
              Write another letter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const busy = phase !== "writing";
  return (
    <>
      <div className="tp-post" data-phase={phase}>
        <form ref={formRef} noValidate className="tp-letterform" onSubmit={submit} aria-busy={busy}>
          <span aria-hidden="true" className="tp-letter__stamp">
            <PawIcon className="size-9" />
          </span>
          <p className="tp-letterform__greeting font-hand-bouncy">Dear TeddyPups,</p>

          <p className="tp-letterform__line">
            my name is{" "}
            <Blank size="16ch">
              <input
                aria-label="Your name (required)"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                name="name"
                value={fields.name}
                onChange={set("name")}
                aria-invalid={invalid("name")}
              />
            </Blank>
            , and you can reach me on{" "}
            <Blank size="15ch">
              <input
                aria-label="Phone or WhatsApp number with country code (required)"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="+971 50 123 4567"
                name="phone"
                value={fields.phone}
                onChange={set("phone")}
                aria-invalid={invalid("phone")}
              />
            </Blank>{" "}
            or by email at{" "}
            <Blank size="20ch">
              <input
                aria-label="Email (optional)"
                type="email"
                autoComplete="email"
                placeholder="optional"
                name="email"
                value={fields.email}
                onChange={set("email")}
                aria-invalid={invalid("email")}
              />
            </Blank>
            .
          </p>

          <p className="tp-letterform__line">
            I live in{" "}
            <Blank size="13ch">
              <input
                aria-label="Your area (optional)"
                autoComplete="address-level2"
                maxLength={80}
                placeholder="e.g. Dubai Marina"
                name="area"
                value={fields.area}
                onChange={set("area")}
              />
            </Blank>
            , and I&apos;m curious about{" "}
            <span className="tp-blank tp-blank--select">
              <label htmlFor={selectId} className="sr-only">
                Puppy you&apos;re interested in (optional)
              </label>
              <select id={selectId} name="puppyId" value={fields.puppy} onChange={set("puppy")}>
                <option value="">any puppy (not sure yet)</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </span>
            .
          </p>

          <label htmlFor={messageId} className="sr-only">
            Your message (optional)
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Anything else you'd like to tell us…"
            className="tp-letterform__note"
            value={fields.message}
            onChange={set("message")}
          />

          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
            </label>
          </div>

          {errors.length > 0 ? (
            <div className="tp-letterform__alert" role="alert">
              <p className="font-hand-bouncy">Almost there, we still need:</p>
              <ul>
                {errors.map((e) => (
                  <li key={e.field}>{e.text}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="tp-letterform__sign">
            <p className="font-hand-bouncy">with love, a future puppy parent</p>
            <Button type="submit" disabled={busy} className="disabled:opacity-70">
              Post my letter
            </Button>
          </div>
        </form>

        {busy ? (
          <div className="tp-post__scene" aria-hidden="true">
            <Envelope />
            <PostBox className="tp-post__box" />
          </div>
        ) : null}
      </div>

      <div aria-hidden="true" className="-mt-3 mr-6 ml-auto w-36 md:w-40">
        <div className="aspect-[300/240]">
          <TeddyActor params={{ sit: 1, facing: -1, tilt: 6 }} />
        </div>
      </div>
    </>
  );
}
