import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignStage } from "@/components/site/ObosthanSlides";
import { Reveal } from "@/components/site/Reveal";
import { bnNumeral, campaignDemands, campaignPath } from "@/lib/campaigns";
import { getCampaignBySlug } from "@/lib/db";
import { shareMeta } from "@/lib/locale";

export async function campaignMeta(slug: string) {
  const item = await getCampaignBySlug(slug);
  if (!item || !item.published) return { title: "কর্মসূচি", robots: { index: false, follow: false } };
  return shareMeta(campaignPath(item.slug), item.intro || item.title, item.lead || item.title);
}

export async function CampaignView({ slug }: { slug: string }) {
  const item = await getCampaignBySlug(slug);
  if (!item || !item.published) notFound();
  const demands = campaignDemands(item.demands);
  const images = item.images.filter((image) => image.url);
  const headline = item.intro || item.title;

  return (
    <article lang="bn">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <Reveal>
            <p className="text-sm font-medium tracking-wide text-donate">কর্মসূচি</p>
          </Reveal>
          <Reveal index={1}>
            <h1 className="mt-3 text-3xl leading-[1.4] text-forest md:text-5xl">{headline}</h1>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        {images.length > 0 ? (
          <Reveal>
            <CampaignStage images={images} />
          </Reveal>
        ) : null}

        {item.lead ? (
          <Reveal index={1}>
            <p className="mt-8 text-lg leading-relaxed text-ink md:text-xl">{item.lead}</p>
          </Reveal>
        ) : null}

        {item.title && item.intro ? (
          <Reveal index={1}>
            <p className="mt-8 text-lg leading-relaxed text-ink md:text-xl">{item.title}</p>
          </Reveal>
        ) : null}

        {item.place || item.host ? (
          <Reveal index={2} className="mt-6 grid gap-3 sm:grid-cols-2">
            {item.place ? (
              <p className="rounded-2xl bg-white px-5 py-4 text-forest ring-1 ring-forest/10">
                <span className="block text-sm text-donate">স্থান</span>
                {item.place}
              </p>
            ) : null}
            {item.host ? (
              <p className="rounded-2xl bg-white px-5 py-4 text-forest ring-1 ring-forest/10">
                <span className="block text-sm text-donate">আয়োজনে</span>
                {item.host}
              </p>
            ) : null}
          </Reveal>
        ) : null}

        {demands.length > 0 ? (
          <>
            <Reveal index={3} className="mt-12">
              <h2 className="text-sm font-medium tracking-wide text-donate">{bnNumeral(demands.length)} দফা দাবিসমূহ</h2>
            </Reveal>
            <ol className="mt-5 grid gap-4">
              {demands.map((demand, index) => (
                <Reveal key={`${index}-${demand.slice(0, 24)}`} as="li" index={index}>
                  <div className="lift flex items-start gap-4 rounded-2xl bg-white px-5 py-5 ring-1 ring-forest/8 md:gap-6 md:px-7 md:py-6">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest text-lg text-white">{bnNumeral(index + 1)}</span>
                    <p className="pt-2 text-lg leading-relaxed text-ink">{demand}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </>
        ) : null}

        {images.length > 0 ? (
          <div className="mt-12 grid gap-5">
            {images.map((image, index) => (
              <Reveal key={`${image.url}-${index}`} as="figure" index={index}>
                <div className="overflow-hidden rounded-[1.25rem] bg-black ring-1 ring-forest/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt={image.alt} className="h-auto w-full" />
                </div>
                {image.alt ? <figcaption className="mt-2 text-center text-sm text-muted-foreground">{image.alt}</figcaption> : null}
              </Reveal>
            ))}
          </div>
        ) : null}

        <p className="mt-10">
          <Link href="/" className="text-sm font-medium text-leaf">প্রচ্ছদে ফিরে যান</Link>
        </p>
      </div>
    </article>
  );
}
