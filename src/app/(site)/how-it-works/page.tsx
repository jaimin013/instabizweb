import type { Metadata } from "next";
import { HowItWorks } from "@/components/pages/how-it-works";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Two ways to bring your puppy home: meet them in our Dubai showroom, or order a rare breed imported for you.",
};

export default function HowItWorksPage() {
  return <HowItWorks />;
}
