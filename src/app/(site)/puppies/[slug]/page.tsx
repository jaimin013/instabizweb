import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PupSkeleton } from "@/components/pup-page/pup-skeleton";
import { PupStory } from "@/components/pup-page/pup-story";
import { pups } from "@/data/pups";
import { getPup, pupCopy } from "@/lib/pups";

/** One page per puppy in data/pups.ts, built ahead of time. */
export function generateStaticParams() {
  return pups.map((pup) => ({ slug: pup.slug }));
}

export async function generateMetadata({ params }: PageProps<"/puppies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pup = getPup(slug);
  if (!pup) return {};
  const copy = pupCopy(pup);
  return {
    title: copy.title,
    description: copy.description,
    openGraph: { images: [{ url: pup.media[0].src, width: pup.media[0].w, height: pup.media[0].h }] },
  };
}

/** Reads the slug inside Suspense, as Cache Components requires for route params. */
async function PupFromParams({ params }: Pick<PageProps<"/puppies/[slug]">, "params">) {
  const { slug } = await params;
  const pup = getPup(slug);
  if (!pup) notFound();
  return <PupStory pup={pup} />;
}

export default function PupPage({ params }: PageProps<"/puppies/[slug]">) {
  return (
    <Suspense fallback={<PupSkeleton />}>
      <PupFromParams params={params} />
    </Suspense>
  );
}
