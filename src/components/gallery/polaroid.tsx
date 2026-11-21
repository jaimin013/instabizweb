import Image from "next/image";
import type { CSSProperties } from "react";
import type { WallPhoto } from "@/data/wall";

/**
 * A photo print held up with tape. Two layouts:
 *  - "natural": the photo keeps its own proportions (the masonry wall)
 *  - "cropped": a fixed 4:4.6 frame (the shop-front wall)
 */
export function Polaroid({
  photo,
  tilt,
  tape,
  tapes,
  index,
  caption,
  layout = "natural",
  sizes,
  priority = false,
}: {
  photo: WallPhoto;
  tilt: number;
  tape: string;
  tapes: WallPhoto["tapes"];
  index: number;
  caption?: string;
  layout?: "natural" | "cropped";
  sizes: string;
  priority?: boolean;
}) {
  return (
    <span
      className="polaroid"
      style={{ "--tilt": `${tilt}deg`, "--tape": tape, "--i": index } as CSSProperties}
    >
      {tapes.map((kind) => (
        <span key={kind} aria-hidden="true" className={`tape tape--${kind}`} />
      ))}
      <span className="polaroid-photo" style={{ backgroundColor: photo.tint }}>
        {layout === "cropped" ? (
          <Image
            src={photo.src}
            alt="A happy TeddyPups family with their new puppy"
            fill
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            className="object-cover"
          />
        ) : (
          <Image
            src={photo.src}
            alt="A happy TeddyPups family with their new puppy"
            width={photo.w}
            height={photo.h}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </span>
      <span className="polaroid-caption font-hand">{caption ?? photo.caption}</span>
    </span>
  );
}
