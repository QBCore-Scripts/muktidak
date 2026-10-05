import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { getPublicMedia, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "গ্যালারি",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর ছবি ও ডকুমেন্ট।",
};

export default function GalleryPage() {
  const copy = getSettings().copy;
  const items = getPublicMedia();

  return (
    <>
      <PageHeader kicker={copy.galleryKicker} title={copy.galleryTitle} text={copy.galleryText} />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-2xl border border-line bg-paper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.name.replace(/\.[a-z]+$/i, "").replaceAll("-", " ")} className="h-52 w-full object-cover" />
            <figcaption className="panel px-4 py-3 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-muted">{item.folder}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
