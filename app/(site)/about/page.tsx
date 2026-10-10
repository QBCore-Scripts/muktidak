import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pageBySlug, paragraphs } from "@/lib/content";
import { englishActivity } from "@/lib/english";
import { getActivities } from "@/lib/db";
import { pad2 } from "@/lib/i18n";
import { getSite, localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("about");
}

export default async function AboutPage() {
  const page = await pageBySlug("about");
  const parts = paragraphs(page.body);
  const { locale, settings } = await getSite();
  const activities = (await getActivities()).map((item) => (locale === "en" ? englishActivity(item) : item));

  return (
    <>
      <PageHeader kicker={settings.shortName} title={page.title} text={parts[0]} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_.9fr]">
        <div className="grid content-start gap-5">
          {settings.quote ? (
            <Reveal variant="left">
              <blockquote className="rounded-r-2xl border-l-4 border-destructive bg-[#f8ece8] px-6 py-5">
                {settings.copy.quoteLabel ? <p className="text-xs font-medium tracking-wide text-destructive">{settings.copy.quoteLabel}</p> : null}
                <p className="mt-2 font-heading text-2xl leading-snug text-forest">“{settings.quote}”</p>
              </blockquote>
            </Reveal>
          ) : null}
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
                  <span className="pt-1 text-sm font-semibold text-leaf tabular-nums">{pad2(index + 1, locale)}</span>
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
