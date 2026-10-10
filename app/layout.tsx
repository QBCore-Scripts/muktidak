import type { Metadata } from "next";
import localFont from "next/font/local";
import { NavProgress } from "@/components/site/NavProgress";
import { getSettings } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { siteDescription, siteKeywords, siteNameBn, siteNameEn, siteUrl } from "@/lib/seo";
import "./globals.css";
import { cn } from "@/lib/utils";

const body = localFont({
  src: "./fonts/kalpurush.woff2",
  variable: "--font-body",
  display: "swap",
});

const display = localFont({
  src: "./fonts/bensen-handwriting.woff2",
  variable: "--font-display",
  display: "swap",
});

const englishDescription = "Bangladesh Muktir Dak 71 is a political party working to restore democracy and establish Mujibism.";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, settings] = await Promise.all([getLocale(), getSettings()]);
  const en = locale === "en";
  const title = en ? `${siteNameEn} | ${siteNameBn}` : `${siteNameBn} | ${siteNameEn}`;
  const description = en ? englishDescription : siteDescription;
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: title,
      template: `%s · ${en ? siteNameEn : siteNameBn}`,
    },
    description,
    keywords: siteKeywords,
    applicationName: siteNameEn,
    authors: [{ name: siteNameBn }],
    creator: siteNameBn,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: en ? "en_US" : "bn_BD",
      url: "/",
      siteName: `${siteNameBn} · ${siteNameEn}`,
      title,
      description,
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: en ? "Bangladesh Muktir Dak 71 — a political party for democracy and Mujibism" : "বাংলাদেশ মুক্তির ডাক-৭১ — গণতন্ত্র পুনরুদ্ধার ও মুজিববাদের রাজনৈতিক দল",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
    robots: { index: true, follow: true },
    icons: settings.logoUrl ? { icon: settings.logoUrl, apple: settings.logoUrl } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={cn("h-full", "antialiased", body.variable, display.variable, "font-sans")}>
      <body className="min-h-full flex flex-col font-sans">
        <NavProgress />
        {children}
      </body>
    </html>
  );
}
