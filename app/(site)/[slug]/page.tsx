import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { paragraphs } from "@/lib/content";
import { getPage } from "@/lib/db";
import { getSite } from "@/lib/locale";

type Props = { params: Promise<{ slug: string }> };

const reserved = new Set([
  "home",
  "about",
  "vision",
  "activities",
  "gallery",
  "notices",
  "blogs",
  "districts",
  "contact",
  "donate",
  "manifesto",
  "objectives",
  "committee",
  "admin",
  "api",
]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = reserved.has(slug) ? null : await getPage(slug);
  return {
    title: page?.title || "পাতা",
    description: page?.body.replace(/\s+/g, " ").trim().slice(0, 160) || undefined,
  };
}

export default async function ExtraPage({ params }: Props) {
  const { slug } = await params;
  if (reserved.has(slug)) notFound();
  const page = await getPage(slug);
  if (!page) notFound();
  const { settings } = await getSite();
  const parts = paragraphs(page.body);

  return (
    <>
      <PageHeader kicker={settings.shortName} title={page.title} text={parts[0]} />
      {parts.length > 1 ? (
        <div className="mx-auto grid max-w-3xl gap-5 px-4 py-12">
          {parts.slice(1).map((part) => (
            <Reveal key={part}>
              <p className="text-ink/90">{part}</p>
            </Reveal>
          ))}
        </div>
      ) : null}
    </>
  );
}
