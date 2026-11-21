import type { Metadata } from "next";
import { PuppiesBoard } from "@/components/pages/puppies-board";

export const metadata: Metadata = {
  title: "Available puppies",
  description:
    "Every listing shows real photos of the actual puppy. Browse Maltipoo, Pomeranian, Poodle, Cavapoo and Shih Tzu puppies in Dubai.",
};

export default function PuppiesPage() {
  return <PuppiesBoard />;
}
