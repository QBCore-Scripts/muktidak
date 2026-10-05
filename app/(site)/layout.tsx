import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getSettings } from "@/lib/db";
import { siteDescription, siteNameBn, siteNameEn, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  const origin = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PoliticalParty",
    name: siteNameBn,
    alternateName: [siteNameEn, "Muktir Dak 71", settings.shortName],
    url: origin,
    description: siteDescription,
    email: settings.email,
    telephone: settings.phone,
    address: { "@type": "PostalAddress", addressCountry: "BD", streetAddress: settings.address },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2">
        মূল অংশে যান
      </a>
      <Header name={settings.name} copy={settings.copy} />
      <main id="main" className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
