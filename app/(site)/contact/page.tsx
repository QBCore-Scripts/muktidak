import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHeader } from "@/components/site/PageHeader";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর সাথে যোগাযোগ।",
};

export default function ContactPage() {
  const settings = getSettings();

  return (
    <>
      <PageHeader kicker={settings.copy.contactKicker} title={settings.copy.contactTitle} text={settings.address} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[.8fr_1.1fr]">
        <aside className="panel panel-forest rounded-2xl bg-forest p-6 text-paper">
          <h2 className="text-lg font-semibold">{settings.copy.contactOffice}</h2>
          <p className="mt-3 text-sm leading-relaxed text-paper/80">{settings.address}</p>
          <p className="mt-4 text-sm"><a href={`tel:${settings.phone}`}>{settings.phone}</a></p>
          <p className="mt-1 text-sm"><a href={`mailto:${settings.email}`}>{settings.email}</a></p>
        </aside>
        <ContactForm />
      </div>
    </>
  );
}
