import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getDistricts, getSettings } from "@/lib/db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "জেলা ও দপ্তর",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর জেলা দপ্তর।",
};

export default async function DistrictsPage() {
  const copy = (await getSettings()).copy;
  const districts = await getDistricts();

  return (
    <>
      <PageHeader kicker={copy.districtsKicker} title={copy.districtsTitle} text={copy.districtsText} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-2">
        {districts.map((item, index) => (
          <Reveal key={item.id} index={index % 2}>
            <Card className="lift h-full rounded-2xl ring-forest/8 [--card-spacing:--spacing(6)] hover:ring-leaf/40">
              <CardHeader>
                <CardTitle className="text-2xl text-forest">{item.name}</CardTitle>
                {item.office ? <CardDescription>{item.office}</CardDescription> : null}
                <CardAction>
                  <Badge variant="secondary">{new Intl.NumberFormat("bn-BD").format(item.members)} সদস্য</Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="mt-auto justify-between gap-3 bg-paper">
                <span className="font-medium">{item.contact}</span>
                {item.phone ? (
                  <a href={`tel:${item.phone}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full tabular-nums")}>
                    {item.phone}
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
