import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { latinDigits } from "@/lib/english";
import { getSite } from "@/lib/locale";
import { jsonLdScript, siteDescription, siteNameBn, siteNameEn, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { locale, t, settings } = await getSite();
  const origin = siteUrl();
  const logoPath = settings.logoUrl || "/logo.png";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PoliticalParty",
    name: siteNameBn,
    alternateName: [siteNameEn, "Muktir Dak 71", settings.shortName],
    url: origin,
    logo: logoPath.startsWith("http") ? logoPath : `${origin}${logoPath}`,
    image: `${origin}/og.jpg`,
    description: siteDescription,
    email: settings.email,
    telephone: latinDigits(settings.phone),
    address: { "@type": "PostalAddress", addressCountry: "BD", streetAddress: settings.address },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2">
        {t.skipToMain}
      </a>
      <Header name={settings.name} copy={settings.copy} t={t} locale={locale} logo={settings.logoUrl} />
      <main id="main" className="flex-1 overflow-x-clip">{children}</main>
      <Footer settings={settings} locale={locale} />
    </>
  );
}
