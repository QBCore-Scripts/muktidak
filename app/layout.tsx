import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import { siteDescription, siteKeywords, siteNameBn, siteNameEn, siteUrl } from "@/lib/seo";
import "./globals.css";

const bangla = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

const title = `${siteNameBn} | ${siteNameEn}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: title,
    template: `%s · ${siteNameBn}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: siteNameEn,
  authors: [{ name: siteNameBn }],
  creator: siteNameBn,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "/",
    siteName: `${siteNameBn} · ${siteNameEn}`,
    title,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${bangla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
