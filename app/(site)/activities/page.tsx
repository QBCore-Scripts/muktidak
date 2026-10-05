import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getActivities } from "@/lib/db";
import { pad2 } from "@/lib/i18n";
import { getSite, localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("activities");
}

export default async function ActivitiesPage() {
  const page = await pageBySlug("activities");
  const intro = paragraphs(page.body)[0];
  const { locale, settings } = await getSite();
  const copy = settings.copy;
  const activities = await getActivities();

  return (
    <>
      <PageHeader kicker={copy.activitiesKicker} title={page.title} text={intro} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-2">
        {activities.map((item, index) => (
          <Reveal key={item.id} index={index % 2}>
            <Card className="lift h-full gap-5 rounded-2xl py-7 ring-forest/8 [--card-spacing:--spacing(7)] hover:ring-leaf/40">
              <CardHeader>
                {item.date ? <Badge variant="outline" className="border-leaf/30 text-leaf">{item.date}</Badge> : null}
                <CardTitle className="mt-2 text-3xl text-forest">{item.title}</CardTitle>
                <CardAction>
                  <span className="font-heading text-5xl leading-none text-forest/10">{pad2(index + 1, locale)}</span>
                </CardAction>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{item.summary}</CardDescription>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </>
  );
}
