import type { SVGProps } from "react";

/** One big pad + four toes. Drawn for this project (also used for the cursor). */
export function PawIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M32 31c-7.4 0-15 8-15 15 0 5.2 4 8 8.8 8 2.6 0 4.6-1.1 6.2-1.1s3.6 1.1 6.2 1.1c4.8 0 8.8-2.8 8.8-8 0-7-7.6-15-15-15z" />
      <ellipse cx="14.6" cy="29.2" rx="4.6" ry="6" transform="rotate(-28 14.6 29.2)" />
      <ellipse cx="24.2" cy="16.6" rx="5" ry="6.6" transform="rotate(-10 24.2 16.6)" />
      <ellipse cx="39.8" cy="16.6" rx="5" ry="6.6" transform="rotate(10 39.8 16.6)" />
      <ellipse cx="49.4" cy="29.2" rx="4.6" ry="6" transform="rotate(28 49.4 29.2)" />
    </svg>
  );
}
