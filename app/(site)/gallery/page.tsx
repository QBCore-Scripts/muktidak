import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getPublicMedia, getSettings } from "@/lib/db";

const tints = ["tile-green", "tile-blue", "tile-red"];

export const metadata: Metadata = {
  title: "গ্যালারি",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর ছবি ও ডকুমেন্ট।",
};

export default async function GalleryPage() {
  const copy = (await getSettings()).copy;
  const items = await getPublicMedia();

  return (
    <>
      <PageHeader kicker={copy.galleryKicker} title={copy.galleryTitle} text={copy.galleryText} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.id} as="figure" variant="zoom" index={index % 3} className={`tile lift group ${tints[index % tints.length]}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.name.replace(/\.[a-z]+$/i, "").replaceAll("-", " ")} loading="lazy" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-xs text-white/75">{item.folder}</p>
              <p className="font-heading text-xl leading-snug">{item.name.replace(/\.[a-z]+$/i, "")}</p>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </>
  );
}
