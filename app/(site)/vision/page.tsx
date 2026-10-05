import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { visionCards } from "@/lib/copy";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "ভিশন",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) — মাঠের রাজনীতির ভিশন।",
};

export default function VisionPage() {
  const page = pageBySlug("vision");
  const parts = paragraphs(page.body);
  const copy = getSettings().copy;
  const points = visionCards(copy.visionPoints);

  return (
    <>
      <PageHeader kicker={copy.visionKicker} title={page.title} text={parts[0]} />
      <div className="mx-auto max-w-6xl px-4 py-10">
        {parts.slice(1).map((part) => (
          <p key={part} className="max-w-3xl leading-relaxed text-ink/90">{part}</p>
        ))}
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {points.map(({ title, text }, index) => (
            <li key={title} className="panel rounded-2xl border border-line bg-paper p-5">
              <p className="text-sm font-semibold text-leaf">{new Intl.NumberFormat("bn-BD", { minimumIntegerDigits: 2 }).format(index + 1)}</p>
              <h2 className="mt-2 text-xl font-semibold text-forest">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
