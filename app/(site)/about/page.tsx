import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getActivities, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "পরিচিতি",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) রাজনৈতিক দলের পরিচিতি।",
};

const bn2 = new Intl.NumberFormat("bn-BD", { minimumIntegerDigits: 2 });

export default async function AboutPage() {
  const page = await pageBySlug("about");
  const parts = paragraphs(page.body);
  const settings = await getSettings();
  const activities = await getActivities();

  return (
    <>
      <PageHeader kicker={settings.shortName} title={page.title} text={parts[0]} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_.9fr]">
        <div className="grid content-start gap-5">
          <Reveal variant="left">
            <blockquote className="rounded-r-2xl border-l-4 border-destructive bg-[#f8ece8] px-6 py-5 font-heading text-2xl leading-snug text-forest">
              “{settings.quote}”
            </blockquote>
          </Reveal>
          {parts.slice(1).map((part) => (
            <Reveal key={part}>
              <p className="text-ink/90">{part}</p>
            </Reveal>
          ))}
        </div>
        <aside className="grid content-start gap-3">
          {activities.slice(0, 3).map((item, index) => (
            <Reveal key={item.id} variant="right" index={index}>
              <Card className="lift ring-forest/8 hover:ring-leaf/40">
                <CardHeader className="grid-cols-[auto_auto_1fr] items-start gap-x-4">
                  <span className="pt-1 text-sm font-semibold text-leaf tabular-nums">{bn2.format(index + 1)}</span>
                  <Separator orientation="vertical" />
                  <div>
                    <CardTitle className="text-xl text-forest">{item.title}</CardTitle>
                    <CardDescription className="mt-1">{item.summary}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </aside>
      </div>
    </>
  );
}
