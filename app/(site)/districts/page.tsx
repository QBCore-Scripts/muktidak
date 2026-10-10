import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { englishText, latinDigits, telHref } from "@/lib/english";
import { getDistricts } from "@/lib/db";
import { intlLocale } from "@/lib/i18n";
import { getSite, localizedMeta } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function generateMetadata() {
  return localizedMeta("districts");
}

export default async function DistrictsPage() {
  const { locale, t, settings } = await getSite();
  const copy = settings.copy;
  const districts = await getDistricts();

  return (
    <>
      <PageHeader kicker={copy.districtsKicker} title={copy.districtsTitle} text={copy.districtsText} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-2">
        {districts.length === 0 ? <p className="text-sm text-muted-foreground md:col-span-2">{t.emptyDistricts}</p> : null}
        {districts.map((item, index) => (
          <Reveal key={item.id} index={index % 2}>
            <Card className="lift h-full rounded-2xl ring-forest/8 [--card-spacing:--spacing(6)] hover:ring-leaf/40">
              <CardHeader>
                <CardTitle className="text-2xl text-forest">{locale === "en" ? englishText(item.name) : item.name}</CardTitle>
                {item.office ? <CardDescription>{locale === "en" ? englishText(item.office) : item.office}</CardDescription> : null}
                <CardAction>
                  <Badge variant="secondary">{new Intl.NumberFormat(intlLocale(locale)).format(item.members)} {t.members}</Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="mt-auto justify-between gap-3 bg-paper">
                <span className="font-medium">{item.contact}</span>
                {telHref(item.phone) ? (
                  <a href={telHref(item.phone)} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full tabular-nums")}>
                    {locale === "en" ? latinDigits(item.phone) : item.phone}
                  </a>
                ) : null}
              </CardFooter>
            </Card>
          </Reveal>
        ))}
      </div>
    </>
  );
}
