import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { getDistricts, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "জেলা ও দপ্তর",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর জেলা দপ্তর।",
};

export default function DistrictsPage() {
  const copy = getSettings().copy;
  const districts = getDistricts();

  return (
    <>
      <PageHeader kicker={copy.districtsKicker} title={copy.districtsTitle} text={copy.districtsText} />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-2">
        {districts.map((item) => (
          <article key={item.id} className="panel rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-forest">{item.name}</h2>
              <span className="rounded-full bg-moss px-2.5 py-1 text-xs font-medium text-forest">
                {new Intl.NumberFormat("bn-BD").format(item.members)} সদস্য
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{item.office}</p>
            <p className="mt-4 font-medium">{item.contact}</p>
            <p className="text-sm"><a href={`tel:${item.phone}`}>{item.phone}</a></p>
          </article>
        ))}
      </div>
    </>
  );
}
