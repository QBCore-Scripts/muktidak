import type { Metadata } from "next";
import { cookies } from "next/headers";
import { cache } from "react";
import { getSettings } from "./db";
import { englishAddress, englishCopy, englishQuote, englishTagline, latinDigits } from "./english";
import { LOCALE_COOKIE, pageMeta, uiText, type Locale, type PageKey } from "./i18n";
import { siteNameEn } from "./seo";

const pagePath: Record<PageKey, string> = {
  about: "/about",
  activities: "/activities",
  blogs: "/blogs",
  committee: "/committee",
  contact: "/contact",
  districts: "/districts",
  donate: "/donate",
  gallery: "/gallery",
  manifesto: "/manifesto",
  notices: "/notices",
  objectives: "/objectives",
  vision: "/vision",
};

export function shareMeta(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}

export const getLocale = cache(async (): Promise<Locale> => {
  return (await cookies()).get(LOCALE_COOKIE)?.value === "en" ? "en" : "bn";
});

export const getSite = cache(async () => {
  const [locale, settings] = await Promise.all([getLocale(), getSettings()]);
  if (locale === "bn") return { locale, t: uiText.bn, settings };
  return {
    locale,
    t: uiText.en,
    settings: {
      ...settings,
      name: siteNameEn,
      shortName: "Muktir Dak 71",
      tagline: englishTagline,
      quote: englishQuote,
      address: englishAddress,
      phone: latinDigits(settings.phone),
      copy: { ...englishCopy, heroVideo: settings.copy.heroVideo || englishCopy.heroVideo },
    },
  };
});

export async function localizedMeta(key: PageKey) {
  const meta = pageMeta[await getLocale()][key];
  return shareMeta(pagePath[key], meta.title, meta.description);
}
