import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getPublicMedia } from "@/lib/db";
import { getSite, localizedMeta } from "@/lib/locale";

const tints = ["tile-green", "tile-blue", "tile-red"];

export function generateMetadata() {
  return localizedMeta("gallery");
}

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const copy = (await getSite()).settings.copy;
  const cat = ((await searchParams).cat || "").trim();
  const all = await getPublicMedia();
  const categories = [...new Set(all.map((item) => item.folder).filter(Boolean))];
  const items = cat ? all.filter((item) => item.folder === cat) : all;

  return (
    <>
      <PageHeader kicker={copy.galleryKicker} title={copy.galleryTitle} text={copy.galleryText} />
      {categories.length > 0 ? (
        <nav aria-label="ক্যাটাগরি" className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pt-8">
          <Link href="/gallery" className={`rounded-full px-3 py-1.5 text-sm ${cat ? "border border-line bg-paper" : "bg-forest text-paper"}`}>সব</Link>
          {categories.map((item) => (
            <Link key={item} href={`/gallery?cat=${encodeURIComponent(item)}`} className={`rounded-full px-3 py-1.5 text-sm ${cat === item ? "bg-forest text-paper" : "border border-line bg-paper"}`}>
              {item}
            </Link>
          ))}
        </nav>
      ) : null}
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? <p className="text-sm text-muted-foreground">এই ক্যাটাগরিতে এখনো ছবি নেই।</p> : null}
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
