import type { Metadata } from "next";
import localFont from "next/font/local";
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
    <html lang="bn" data-scroll-behavior="smooth" className={cn("h-full", "antialiased", body.variable, display.variable, "font-sans")}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
