import type { Metadata } from "next";
import { GoneTickets } from "@/components/pages/gone-tickets";
import { gonePups } from "@/lib/pups";

export const metadata: Metadata = {
  title: "Gone home",
  description:
    "Puppies who have already joined a loving family. Looking for one just like them? We will help you find your match.",
};

export default function GoneHomePage() {
  return (
    <div className="tp-gone">
      <GoneTickets pups={gonePups} />
    </div>
  );
}
