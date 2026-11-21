"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PawIcon } from "@/components/icons/paw";
import { PupAnchor } from "@/components/pup/pup-layer";
import { ButtonLink } from "@/components/ui/button";
import { site, whatsappLink } from "@/lib/site";

const steps = [
  {
    title: "Choose your breed",
    text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.",
  },
  {
    title: "Get photos & details",
    text: "Our team will share real photos, health details, and all necessary information directly on WhatsApp.",
  },
  {
    title: "Secure & safe delivery",
    text: "Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.",
  },
] as const;

const breeds = [
  { label: "Maltipoo", slug: "maltipoo" },
  { label: "Pomeranian", slug: "pomeranian" },
  { label: "Poodle", slug: "poodle" },
  { label: "Cavapoo", slug: "cavapoo" },
  { label: "Shih Tzu", slug: "shih-tzu" },
] as const;

const snaps = [
  {
    src: "/puppies/showroom.jpg",
    alt: "A tiny apricot teddy bear puppy held up in the TeddyPups showroom",
    at: "54.3% 48.3%",
    tint: "#685848",
  },
  {
    src: "/puppies/showroom-2.jpg",
    alt: "The apricot teddy bear puppy from our showroom, close up",
    at: "46% 44.4%",
    tint: "#685848",
  },
  {
    src: "/puppies/showroom-3.jpg",
    alt: "The apricot teddy bear puppy from our showroom, looking up",
    at: "43.7% 40.2%",
    tint: "#080818",
  },
  {
    src: "/puppies/showroom-4.jpg",
    alt: "The apricot teddy bear puppy from our showroom, held up to say hello",
    at: "45.3% 44.4%",
    tint: "#685848",
  },
] as const;

/** A step "arrives" once its top edge passes this fraction of the viewport height. */
const TRIGGER = 0.375;
/** How long the typing dots show before each message group appears. */
const TYPING_MS = 800;

/** A short video in a chat bubble: tap to play, tap again to pause. */
function Clip() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  return (
    <div className="clip">
      <video
        ref={video}
        src="/media/showroom.mp4"
        poster="/puppies/showroom.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-label="Video of a tiny apricot teddy bear puppy in the TeddyPups showroom"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className="clip-play"
        aria-pressed={playing}
        aria-label={playing ? "Pause video" : "Play video"}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
        </svg>
      </button>
    </div>
  );
}

/**
 * "Your puppy journey".
 *
 * Scroll drives a small story: as each step reaches 37.5 % of the screen it lights up
 * and a typing indicator leads into its chat message. Scrolling back up un-sends them.
 * Messages that should already be there when the page loads mid-section appear at once.
 */
export function JourneyChat() {
  const reduceMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [active, setActive] = useState(-1);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let current = -1;
    let visible = 0;
    let timer: number | undefined;
    let frame = 0;
    let firstPass = true;

    const reveal = (target: number) => {
      window.clearTimeout(timer);
      if (target <= visible) {
        visible = target;
        setShown(target);
        setTyping(false);
        return;
      }
      const next = () => {
        if (visible >= target) {
          setTyping(false);
          return;
        }
        setTyping(true);
        timer = window.setTimeout(() => {
          visible += 1;
          setShown(visible);
          setTyping(false);
          timer = window.setTimeout(next, 250);
        }, TYPING_MS);
      };
      next();
    };

    const update = () => {
      frame = 0;
      const line = window.innerHeight * TRIGGER;
      let index = -1;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) index = i;
      });
      if (index === current) {
        firstPass = false;
        return;
      }

      const previous = current;
      current = index;
      setActive(index);

      // Landing already inside the section (or reduced motion): no theatre, just show the state.
      if (firstPass || reduceMotion || Math.abs(index - previous) > 1) {
        window.clearTimeout(timer);
        visible = index + 1;
        setShown(visible);
        setTyping(false);
      } else {
        reveal(index + 1);
      }
      firstPass = false;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <section data-pup-lane="" aria-labelledby="journey-title" className="chat">
      <div ref={gridRef} className="chat-grid container-wide">
        <div className="chat-story">
          <h2 id="journey-title" className="text-huge">
            Your puppy journey
          </h2>
          <p className="mt-5 max-w-[42ch] text-lede text-ink-soft">
            A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
          </p>

          <ol className="chat-steps">
            {steps.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="chat-step"
                data-done={i < active ? "true" : undefined}
                data-active={i === active ? "true" : undefined}
              >
                <span className="chat-num font-plush" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="chat-title">{step.title}</h3>
                <p className="chat-text">{step.text}</p>
              </li>
            ))}
          </ol>

          <ButtonLink href="/how-it-works" variant="ghost" className="chat-cta">
            How it works
          </ButtonLink>
        </div>

        <div ref={sideRef} className="chat-side">
          <div className="phone" role="group" aria-label={`A WhatsApp conversation with ${site.legalName}`}>
            <div className="phone-bar">
              <Image src="/brand/logo.png" alt="" width={40} height={40} className="phone-avatar" />
              <span>
                <span className="phone-name">{site.legalName}</span>
                <span className="phone-status">online</span>
              </span>
            </div>

            <div className="phone-screen">
              <p className="msg msg--me">Hi TeddyPups! I&apos;d love to know more about your puppies.</p>

              <div className="msg-group" data-show={shown > 0}>
                <div className="msg msg--them">
                  <p>{steps[0].text}</p>
                  <ul className="chips" aria-label="Breeds we have now">
                    {breeds.map((b) => (
                      <li key={b.slug}>
                        <Link href={`/puppies?breed=${b.slug}`}>{b.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="msg-group" data-show={shown > 1}>
                <div className="msg msg--them msg--media">
                  <div className="snaps">
                    {snaps.map((snap) => (
                      <span key={snap.src} className="snaps-one" style={{ backgroundColor: snap.tint }}>
                        <Image
                          src={snap.src}
                          alt={snap.alt}
                          fill
                          sizes="9rem"
                          className="object-cover"
                          style={{ objectPosition: snap.at }}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="msg msg--them msg--media">
                  <Clip />
                </div>
                <p className="msg msg--them">{steps[1].text}</p>
              </div>

              <div className="msg-group" data-show={shown > 2}>
                <div className="msg msg--them">
                  <p>{steps[2].text}</p>
                  <svg viewBox="0 0 220 70" className="route" aria-hidden="true">
                    <path d="M14 52C60 6 120 70 170 28" className="route-line" />
                    <circle cx="14" cy="52" r="5" className="route-dot" />
                    <path d="M164 32l12-12 12 12v14h-24z" className="route-home" />
                    <path
                      d="M176 44c-4-2.8-6-4.6-6-6.8 0-1.7 1.3-2.8 2.8-2.8 1.1 0 2.3.7 3.2 1.7.9-1 2.1-1.7 3.2-1.7 1.5 0 2.8 1.1 2.8 2.8 0 2.2-2 4-6 6.8z"
                      className="route-heart"
                    />
                    <PawIcon
                      x={58}
                      y={8}
                      width={18}
                      height={18}
                      className="route-paw"
                      style={{ rotate: "70deg" }}
                    />
                    <PawIcon
                      x={95}
                      y={24}
                      width={18}
                      height={18}
                      className="route-paw"
                      style={{ rotate: "100deg" }}
                    />
                  </svg>
                </div>
              </div>

              <p className="typing" data-show={typing} aria-hidden="true">
                <span />
                <span />
                <span />
              </p>
            </div>

            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="phone-compose">
              <span>Say hello on WhatsApp</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
              </svg>
            </a>
          </div>

          {/* Teddy waits beside the phone while it is on screen */}
          <PupAnchor
            id="journey"
            pose="sit"
            fit="foot"
            className="chat-teddy"
            pin={{ section: gridRef, stage: sideRef }}
          />
        </div>
      </div>
    </section>
  );
}
