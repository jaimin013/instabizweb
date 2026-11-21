import type { Metadata } from "next";
import { HappyWall } from "@/components/pages/happy-wall";

export const metadata: Metadata = {
  title: "Happy families",
  description: "A wall of happy endings: photos from families who welcomed a TeddyPups puppy home.",
};

export default function HappyFamiliesPage() {
  return <HappyWall />;
}
