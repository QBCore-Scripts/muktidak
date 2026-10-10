import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { NotFoundPanel } from "@/components/site/NotFoundPanel";
import { getSite } from "@/lib/locale";

export const metadata: Metadata = {
  title: "পাতা পাওয়া যায়নি",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const { locale, t, settings } = await getSite();
  return (
    <>
      <Header name={settings.name} copy={settings.copy} t={t} locale={locale} logo={settings.logoUrl} />
      <main id="main" className="flex-1">
        <NotFoundPanel t={t} />
      </main>
      <Footer settings={settings} locale={locale} />
    </>
  );
}
