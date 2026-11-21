import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Pill button with the site's "pressed sticker" shadow: a hard cocoa
 * offset that grows on hover while the button tilts slightly, then
 * squashes on press.
 */
const base =
  "inline-flex min-h-13 items-center justify-center gap-2.5 rounded-pill px-6.5 py-3.5 text-[1.0625rem] font-[650] leading-[1.1] no-underline " +
  "transition-[transform,background-color,color,box-shadow] duration-[350ms,250ms,250ms,350ms] ease-pounce active:scale-96";

const variants = {
  primary:
    "bg-toffee-deep text-milk shadow-press hover:-translate-y-0.5 hover:-rotate-1 hover:shadow-press-hover",
  whatsapp:
    "bg-whatsapp text-white shadow-press hover:-translate-y-0.5 hover:rotate-1 hover:shadow-press-hover",
  ghost: "border-2 border-line bg-transparent text-ink hover:bg-ink hover:text-surface",
} as const;

type ButtonVariant = keyof typeof variants;

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant };

/** Internal or external link styled as a button. */
export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  const external = typeof props.href === "string" && /^https?:/.test(props.href);
  return (
    <Link
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
      className={cn(base, variants[variant], className)}
    />
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} {...props} className={cn(base, variants[variant], className)} />;
}
