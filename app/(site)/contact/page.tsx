import { ContactForm } from "@/components/site/ContactForm";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { telHref } from "@/lib/english";
import { getSite, localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("contact");
}

export default async function ContactPage() {
  const { locale, t, settings } = await getSite();
  const rows = [
    [t.address, settings.address, ""],
    [t.phone, settings.phone, telHref(settings.phone)],
    [t.email, settings.email, `mailto:${settings.email}`],
  ].filter(([, value]) => value);

  return (
    <>
      <PageHeader kicker={settings.copy.contactKicker} title={settings.copy.contactTitle} text={settings.address} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[.8fr_1.1fr]">
        <Reveal variant="left" className="self-start">
          <Card className="panel panel-forest rounded-3xl bg-forest py-7 text-paper ring-0 [--card-spacing:--spacing(7)]">
            <CardHeader>
              <CardTitle className="text-2xl">{settings.copy.contactOffice}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {rows.map(([label, value, href], index) => (
                <div key={label}>
                  {index > 0 ? <Separator className="mb-4 bg-white/15" /> : null}
                  <p className="text-xs text-paper/60">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block text-base hover:text-white">{value}</a>
                  ) : (
                    <p className="mt-1 text-base text-paper/90">{value}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </Reveal>
        <Reveal variant="right" index={1}>
          <ContactForm t={t} locale={locale} />
        </Reveal>
      </div>
    </>
  );
}
