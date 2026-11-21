"use client";

import { useEffect, useState } from "react";
import { TeddyActor } from "@/components/mascot/teddy-actor";

export const MEDIA_EVENT = "pup:media";
const WORDS = ["hm?", "ooh!", "woof!", "hi!"] as const;
const VIDEO_WORDS = ["action!", "play it!"] as const;

/** Teddy perched on the puppy's tag. He comments when you flip to another photo or video. */
export function TagBuddy() {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    let timer = 0;
    const onMedia = (event: Event) => {
      const video = (event as CustomEvent<{ video: boolean }>).detail?.video;
      const pool = video ? VIDEO_WORDS : WORDS;
      setLine(pool[Math.floor(Math.random() * pool.length)]);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setLine(null), 1500);
    };
    window.addEventListener(MEDIA_EVENT, onMedia);
    return () => {
      window.removeEventListener(MEDIA_EVENT, onMedia);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="pup-buddy absolute! -top-[4.8rem] right-6 w-[9.5rem]" aria-hidden="true">
      <div className="aspect-[300/240]">
        <TeddyActor params={{ sit: 1, facing: 1 }} />
      </div>
      <span className="pup-bubble" data-show={line !== null}>
        {line}
      </span>
    </div>
  );
}
