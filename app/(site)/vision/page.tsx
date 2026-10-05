import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { visionCards } from "@/lib/copy";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "ভিশন",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) — মাঠের রাজনীতির ভিশন।",
};

const tiles = [
  { src: "/history/speech.jpg", tint: "tile-blue" },
  { src: "/history/fighters.jpg", tint: "tile-green" },
  { src: "/history/victory.jpg", tint: "tile-red" },
];

export default async function VisionPage() {
  const page = await pageBySlug("vision");
  const parts = paragraphs(page.body);
  const copy = (await getSettings()).copy;
  const points = visionCards(copy.visionPoints);

  return (
    <>
      <PageHeader kicker={copy.visionKicker} title={page.title} text={parts[0]} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {parts.slice(1).map((part) => (
          <Reveal key={part}>
            <p className="max-w-3xl text-ink/90">{part}</p>
          </Reveal>
        ))}
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {points.map(({ title, text }, index) => {
            const tile = tiles[index % tiles.length];
            return (
              <Reveal key={title} as="li" variant="zoom" index={index} className={`tile tile-deep lift group flex flex-col justify-end p-6 ${tile.tint}`}>
                <Image src={tile.src} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" />
                <p className="text-sm text-white/75">{new Intl.NumberFormat("bn-BD", { minimumIntegerDigits: 2 }).format(index + 1)}</p>
                <h2 className="mt-1 text-3xl">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{text}</p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </>
  );
}
