import type { Metadata } from "next";
import localFont from "next/font/local";
import { NavProgress } from "@/components/site/NavProgress";
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

const englishDescription = "Bangladesh Muktir Dak 71 is a people's political party — grassroots politics, district offices and open accounts.";

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getLocale()) === "en";
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
          alt: en ? "Bangladesh Muktir Dak 71 — with the people, politics of the field" : "মানুষের পাশে, মাঠের রাজনীতি",
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
