"use client";

import { useRef } from "react";
import { TeddyPeek } from "@/components/mascot/teddy-peek";
import { PupStop } from "@/components/pup/pup-layer";

/**
 * The page's last stop: Teddy curled up in a wicker basket, head and paws over the rim.
 * The basket is drawn in three layers so he sits *inside* it. He is the same peeking figure as in
 * the hero, so when the roaming Teddy arrives here the page's own copy takes over.
 */
export function FooterBasket() {
  const peekRef = useRef<HTMLDivElement>(null);

  return (
    <div className="basket" role="img" aria-label="Teddy, curled up in his basket">
      <svg viewBox="0 0 300 240" className="basket-back" aria-hidden="true">
        <ellipse cx="212" cy="145" rx="96" ry="12" className="basket-hollow" />
        <path d="M116 145A96 12 0 0 1 308 145" className="basket-rim-line" />
        <path d="M116 145A96 12 0 0 1 308 145" className="basket-rim" />
      </svg>

      <div ref={peekRef} className="basket-peek">
        <TeddyPeek className="block w-full" />
      </div>
      <PupStop id="footer" pose="peek" fit="peek" local target={peekRef} />

      <svg viewBox="0 0 300 240" className="basket-front" aria-hidden="true">
        <path
          d="M118 147C122 190 136 224 160 232C190 238 234 238 264 232C288 224 302 190 306 147C260 168 164 168 118 147Z"
          className="basket-body"
        />
        <path d="M121 178Q212 197 303 178M127 206Q212 223 297 206" className="basket-weave" />
        <path
          d="M150 163L157 233M181 168L184 238M212 170V240M243 168L240 238M274 163L267 233"
          className="basket-weave basket-weave--stakes"
        />
        <path d="M116 145A96 12 0 0 0 308 145" className="basket-rim-line" />
        <path d="M116 145A96 12 0 0 0 308 145" className="basket-rim" />
      </svg>
    </div>
  );
}
